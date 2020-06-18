/* global Promise */
import axeCore = require('axe-core');
import rIC = require('requestidlecallback');
import after = require('./after');

const requestIdleCallback = rIC.request;
const cancelIdleCallback = rIC.cancel;

let React;
let ReactDOM;

// contrasted against Chrome default color of #ffffff
const lightTheme = {
  serious: '#d93251',
  minor: '#d24700',
  text: 'black'
};

// contrasted against Safari dark mode color of #535353
const darkTheme = {
  serious: '#ffb3b3',
  minor: '#ffd500',
  text: 'white'
};

const theme =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? darkTheme
    : lightTheme;

const boldCourier = 'font-weight:bold;font-family:Courier;';
const critical = `color:${theme.serious};font-weight:bold;`;
const serious = `color:${theme.serious};font-weight:normal;`;
const moderate = `color:${theme.minor};font-weight:bold;`;
const minor = `color:${theme.minor};font-weight:normal;`;
const defaultReset = `font-color:${theme.text};font-weight:normal;`;

let idleId: number | undefined;
let timeout: number;
let context: axeCore.ElementContext;
let _createElement: typeof React.createElement;
const components: { [id: number]: React.Component } = {};
const nodes: Node[] = [document.documentElement];
const cache: { [key: string]: string } = {};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// @see https://davidwalsh.name/javascript-debounce-function
function debounce(func: Function, wait: number, immediate?: boolean): Function {
  let _timeout;
  return function(...args): void {
    const later = (): void => {
      _timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !_timeout;
    clearTimeout(_timeout);
    _timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

/**
 * Return the entire parent tree of a node (from HTML down).
 * @param {Node} node
 * @return {Node[]}
 */
function getPath(node: Node): Node[] {
  const path: Node[] = [node];
  while (node && node.nodeName.toLowerCase() !== 'html') {
    path.push(node.parentNode);
    node = node.parentNode;
  }
  if (!node || !node.parentNode) {
    return null;
  }
  return path.reverse();
}

/**
 * Find the common parent of an array of nodes.
 * @param {Node[]} nodes
 * @return {Node}
 */
function getCommonParent(nodes: Node[]): Node {
  let path: Node[] | null;
  let nextPath: Node[] | null;
  if (nodes.length === 1) {
    return nodes.pop();
  }
  while (!path && nodes.length) {
    path = getPath(nodes.pop());
  }
  while (nodes.length) {
    nextPath = getPath(nodes.pop());
    if (nextPath) {
      path = path.filter((node: Node, index: number) => {
        return nextPath.length > index && nextPath[index] === node;
      });
    }
  }
  return path ? path[path.length - 1] : document;
}

/**
 * Log the axe result node to the console
 * @param {NodeResult} node
 * @param {Function} logFn console log function to use (error, warn, log, etc.)
 */
function logElement(
  node: axeCore.NodeResult | axeCore.RelatedNode,
  logFn: (...args) => void
): void {
  const el = document.querySelector(node.target.toString());
  if (!el) {
    logFn('Selector: %c%s', boldCourier, node.target.toString());
  } else {
    logFn('Element: %o', el);
  }
}

/**
 * Log the axe result node html tot he console
 * @param {NodeResult} node
 */
function logHtml(node: axeCore.NodeResult | axeCore.RelatedNode): void {
  console.log('HTML: %c%s', boldCourier, node.html);
}

/**
 * Log the failure message of a node result.
 * @param {NodeResult} node
 * @param {String} key which check array to log from (any, all, none)
 */
function logFailureMessage(
  node: axeCore.NodeResult,
  key: AxeCoreNodeResultKey
): void {
  // this exists on axe but we don't export it as part of the typescript
  // namespace, so just let me use it as I need
  const message: string = ((axeCore as unknown) as AxeWithAudit)._audit.data.failureSummaries[
    key
  ].failureMessage(node[key].map(check => check.message || ''));

  console.error(message);
}

/**
 * Log as a group the node result and failure message.
 * @param {NodeResult} node
 * @param {String} key which check array to log from (any, all, none)
 */
function failureSummary(
  node: axeCore.NodeResult,
  key: AxeCoreNodeResultKey
): void {
  if (node[key].length > 0) {
    logElement(node, console.groupCollapsed);
    logHtml(node);
    logFailureMessage(node, key);

    let relatedNodes: axeCore.RelatedNode[] = [];
    node[key].forEach(check => {
      relatedNodes = relatedNodes.concat(check.relatedNodes);
    });

    if (relatedNodes.length > 0) {
      console.groupCollapsed('Related nodes');
      relatedNodes.forEach(relatedNode => {
        logElement(relatedNode, console.log);
        logHtml(relatedNode);
      });
      console.groupEnd();
    }

    console.groupEnd();
  }
}

/**
 * Run axe against the passed in node and report violations
 * @param {*} node
 * @param {Number} timeout force call of axe.run after the timeout has passed (if not called before)
 * @return {Promise}
 */
function checkAndReport(node: Node, timeout: number): Promise<void> {
  if (idleId) {
    cancelIdleCallback(idleId);
    idleId = undefined;
  }

  return new Promise((resolve, reject) => {
    nodes.push(node);
    idleId = requestIdleCallback(
      () => {
        let n: axeCore.ElementContext | Node = context;
        if (n === undefined) {
          n = getCommonParent(nodes.filter(node => node.isConnected));
          if (n.nodeName.toLowerCase() === 'html') {
            // if the only common parent is the body, then analyze the whole page
            n = document;
          }
        }
        axeCore.run(n, { reporter: 'v2' }, function(
          error: Error,
          results: axeCore.AxeResults
        ) {
          if (error) {
            return reject(error);
          }

          results.violations = results.violations.filter(result => {
            result.nodes = result.nodes.filter(node => {
              const key: string = node.target.toString() + result.id;
              const retVal = !cache[key];
              cache[key] = key;
              return retVal;
            });
            return !!result.nodes.length;
          });

          if (results.violations.length) {
            console.group('%cNew axe issues', serious);
            results.violations.forEach(result => {
              let fmt: string;
              switch (result.impact) {
                case 'critical':
                  fmt = critical;
                  break;
                case 'serious':
                  fmt = serious;
                  break;
                case 'moderate':
                  fmt = moderate;
                  break;
                case 'minor':
                  fmt = minor;
                  break;
                default:
                  fmt = minor;
                  break;
              }
              console.groupCollapsed(
                '%c%s: %c%s %s',
                fmt,
                result.impact,
                defaultReset,
                result.help,
                result.helpUrl
              );
              result.nodes.forEach(node => {
                failureSummary(node, 'any');
                failureSummary(node, 'none');
              });
              console.groupEnd();
            });
            console.groupEnd();
          }

          resolve();
        });
      },
      {
        timeout: timeout
      }
    );
  });
}

/**
 * Check the node for violations.
 * @param {Component} component
 */
function checkNode(component: React.Component): void {
  let node: Node;

  try {
    node = ReactDOM.findDOMNode(component);
  } catch (e) {
    console.group('%caxe error: could not check node', critical);
    console.group('%cComponent', serious);
    console.error(component);
    console.groupEnd();
    console.group('%cError', serious);
    console.error(e);
    console.groupEnd();
    console.groupEnd();
  }

  if (node) {
    checkAndReport(node, timeout);
  }
}

/**
 * Check the component for violations whenever the DOM updates
 * @param {Component} component
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function componentAfterRender(component: any): void {
  const debounceCheckNode: Function = debounce(checkNode, timeout, true);
  after(component, 'componentDidMount', debounceCheckNode);
  after(component, 'componentDidUpdate', debounceCheckNode);
}

/**
 * Add a component to track.
 * @param {Component} component
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addComponent(component: any): void {
  const reactInstance = component._reactInternalInstance || {};
  const reactInstanceDebugID = reactInstance._debugID;
  const reactFiberInstance = component._reactInternalFiber || {};
  const reactFiberInstanceDebugID = reactFiberInstance._debugID;

  if (reactInstanceDebugID && !components[reactInstanceDebugID]) {
    components[reactInstanceDebugID] = component;
    componentAfterRender(component);
  } else if (
    reactFiberInstanceDebugID &&
    !components[reactFiberInstanceDebugID]
  ) {
    components[reactFiberInstanceDebugID] = component;
    componentAfterRender(component);
  }
}

/**
 * Run axe against all changes made in a React app.
 * @parma {React} _React React instance
 * @param {ReactDOM} _ReactDOM ReactDOM instance
 * @param {Number} _timeout debounce timeout in milliseconds
 * @parma {Spec} conf axe.configure Spec object
 * @param {ElementContext} _context axe ElementContent object
 */
function reactAxe(
  _React: typeof React,
  _ReactDOM: typeof ReactDOM,
  _timeout: number,
  conf: axeCore.Spec,
  _context: axeCore.ElementContext
): Promise<void> {
  React = _React;
  ReactDOM = _ReactDOM;
  timeout = _timeout;
  context = _context;

  if (conf) {
    axeCore.configure(conf);
  }

  if (!_createElement) {
    _createElement = React.createElement;

    React.createElement = function(...args): React.Component {
      const reactEl = _createElement.apply(this, args);

      if (reactEl._owner && reactEl._owner._instance) {
        addComponent(reactEl._owner._instance);
      } else if (reactEl._owner && reactEl._owner.stateNode) {
        addComponent(reactEl._owner.stateNode);
      }

      return reactEl;
    };
  }

  return checkAndReport(document.body, timeout);
}

export = reactAxe;
