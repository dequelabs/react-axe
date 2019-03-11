/* global document, window, Promise */
var axeCore = require('axe-core');
var rIC = require('requestidlecallback');
var after = require('./after');

var requestIdleCallback = rIC.request;
var cancelIdleCallback = rIC.cancel;

var React = undefined;
var ReactDOM = undefined;

var boldCourier = 'font-weight:bold;font-family:Courier;';
var critical = 'color:red;font-weight:bold;';
var serious = 'color:red;font-weight:normal;';
var moderate = 'color:orange;font-weight:bold;';
var minor = 'color:orange;font-weight:normal;';
var defaultReset = 'font-color:black;font-weight:normal;';

var idleId;
var timeout;
var _createElement;
var components = {};
var nodes = [];
var cache = {};

function getPath(node) {
  var path = [];
  do {
    path.push(node.parentNode);
    node = node.parentNode;
  } while (node && node.nodeName.toLowerCase() !== 'html');
  if (!node || !node.parentNode) {
    return null;
  }
  return path.reverse();
}

function getCommonParent(nodes) {
  var path, nextPath;
  if (nodes.length === 1) {
    return nodes.pop();
  }
  while (!path && nodes.length) {
    path = getPath(nodes.pop());
  }
  while (nodes.length) {
    nextPath = getPath(nodes.pop());
    if (nextPath) {
      path = path.filter(function(node, index) {
        return nextPath.length > index && nextPath[index] === node;
      });
    }
  }
  return path ? path[path.length - 1] : document;
}

function logElement(node, logFn) {
  var el = document.querySelector(node.target.toString());
  if (!el) {
    logFn('Selector: %c%s', boldCourier, node.target.toString());
  } else {
    logFn('Element: %o', el);
  }
}

function logHtml(node) {
  console.log('HTML: %c%s', boldCourier, node.html);
}

function logFailureMessage(node, key) {
  var message = axeCore._audit.data.failureSummaries[key].failureMessage(
    node[key].map(function(check) {
      return check.message || '';
    })
  );

  console.error(message);
}

function failureSummary(node, key) {
  if (node[key].length > 0) {
    logElement(node, console.groupCollapsed);
    logHtml(node);
    logFailureMessage(node, key);

    var relatedNodes = [];
    node[key].forEach(function(check) {
      relatedNodes = relatedNodes.concat(check.relatedNodes);
    });

    if (relatedNodes.length > 0) {
      console.groupCollapsed('Related nodes');
      relatedNodes.forEach(function(relatedNode) {
        logElement(relatedNode, console.log);
        logHtml(relatedNode);
      });
      console.groupEnd();
    }

    console.groupEnd();
  }
}

function createDeferred() {
  var deferred = {};

  deferred.promise = new Promise(function(resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
}

function checkAndReport(node, timeout) {
  if (idleId) {
    cancelIdleCallback(idleId);
    idleId = undefined;
  }

  var deferred = createDeferred();

  nodes.push(node);
  idleId = requestIdleCallback(
    function() {
      var n = getCommonParent(nodes);
      if (n.nodeName.toLowerCase() === 'html') {
        // if the only common parent is the body, then analyze the whole page
        n = document;
      }
      axeCore.run(n, { reporter: 'v2' }, function(error, results) {
        if (error) {
          return deferred.reject(error);
        }

        results.violations = results.violations.filter(function(result) {
          result.nodes = result.nodes.filter(function(node) {
            var key = node.target.toString() + result.id;
            var retVal = !cache[key];
            cache[key] = key;
            return retVal;
          });
          return !!result.nodes.length;
        });
        if (results.violations.length) {
          console.group('%cNew aXe issues', serious);
          results.violations.forEach(function(result) {
            var fmt;
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
            result.nodes.forEach(function(node) {
              failureSummary(node, 'any');
              failureSummary(node, 'none');
            });
            console.groupEnd();
          });
          console.groupEnd();
        }

        deferred.resolve();
      });
    },
    { timeout: timeout }
  );

  return deferred.promise;
}

function checkNode(component) {
  var node = ReactDOM.findDOMNode(component);

  if (node) {
    checkAndReport(node, timeout);
  }
}

function componentAfterRender(component) {
  after(component, 'componentDidMount', checkNode);
  after(component, 'componentDidUpdate', checkNode);
}

function addComponent(component) {
  var reactInstance = component._reactInternalInstance || {};
  var reactInstanceDebugID = reactInstance._debugID;
  var reactFiberInstance = component._reactInternalFiber || {};
  var reactFiberInstanceDebugID = reactFiberInstance._debugID;

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

var reactAxe = function reactAxe(_React, _ReactDOM, _timeout, conf) {
  React = _React;
  ReactDOM = _ReactDOM;
  timeout = _timeout;

  if (conf) {
    axeCore.configure(conf);
  }
  axeCore.configure({
    checks: [
      {
        id: 'color-contrast',
        options: {
          noScroll: true
        }
      }
    ]
  });

  if (!_createElement) {
    _createElement = React.createElement;

    React.createElement = function() {
      var reactEl = _createElement.apply(this, arguments);

      if (reactEl._owner && reactEl._owner._instance) {
        addComponent(reactEl._owner._instance);
      } else if (reactEl._owner && reactEl._owner.stateNode) {
        addComponent(reactEl._owner.stateNode);
      }

      return reactEl;
    };
  }

  return checkAndReport(document.body, timeout);
};

module.exports = reactAxe;
