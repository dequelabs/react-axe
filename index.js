var axeCore = require('axe-core');
var after = require('./after');
var React = undefined;
var ReactDOM = undefined;

var boldCourier = 'font-weight:bold;font-family:Courier;';
var critical = 'color:red;font-weight:bold;';
var serious = 'color:red;font-weight:normal;';
var moderate = 'color:orange;font-weight:bold;';
var minor = 'color:orange;font-weight:normal;';
var defaultReset = 'font-color:black;font-weight:normal;';

var timer;
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
	} while (node && node.nodeName.toLowerCase() !== 'html')
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
			path = path.filter(function (node, index) {
				return (nextPath.length > index && nextPath[index] === node);
			});
		}
	}
	return path[path.length-1];
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

function failureMessage(node, key) {
	return axeCore._audit.data.failureSummaries[key].failureMessage(node[key].map(function (check) {
		return check.message || '';
	}));
}

function failureSummary(node, key) {
	if (node[key].length > 0) {
		logElement(node, console.groupCollapsed);
			logHtml(node);
			console.error(failureMessage(node, key));
			console.groupCollapsed('Related nodes');
				node[key].forEach(function (check) {
					check.relatedNodes.forEach(function (relatedNode) {
						logElement(relatedNode, console.log);
						logHtml(relatedNode);
					});
				});
			console.groupEnd();
		console.groupEnd();
	}
}

function checkAndReport(node, timeout) {
	if (timer) {
		clearTimeout(timer);
		timer = undefined;
	}
	nodes.push(node);
	timer = setTimeout(function () {
		var n = getCommonParent(nodes);
		if (n.nodeName.toLowerCase() === 'html') {
			// if the only common parent is the body, then analyze the whole page
			n = undefined;
		}

		axeCore.a11yCheck(n, { reporter: 'v2' },function (results) {
			results.violations = results.violations.filter(function (result) {
				result.nodes = result.nodes.filter(function (node) {
					var key = node.target.toString() + result.id;
					var retVal = (!cache[key]);
					cache[key] = key;
					return retVal;
				});
				return (!!result.nodes.length);
			});
			if (results.violations.length) {
				console.group('%cNew aXe issues', serious)
				results.violations.forEach(function (result) {
					var fmt;
					switch(result.impact) {
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
					}
					console.groupCollapsed('%c%s: %c%s %s', fmt, result.impact, defaultReset, result.help, result.helpUrl);
					result.nodes.forEach(function (node) {
						failureSummary(node, 'any');
						failureSummary(node, 'none');
					});
					console.groupEnd();
				});
				console.groupEnd();
			}
		});
	}, timeout);
}

function checkNode(component) {
	var node = ReactDOM.findDOMNode(component);

	if(node){
		checkAndReport(node, timeout)
	}
}

function componentAfterRender(component) {
	after(component, 'componentDidMount', checkNode);
	after(component, 'componentDidUpdate', checkNode);
}

function addComponent(component) {
	if (component._reactInternalInstance) {
		components[component._reactInternalInstance._debugID] = component;
		componentAfterRender(component);
	}
}

var reactAxe = function reactAxe(_React, _ReactDOM, _timeout, conf) {
	React = _React;
	ReactDOM = _ReactDOM;
	timeout = timeout;

	if (conf) {
		axeCore.configure(conf);
	}

	if (!_createElement) {
		_createElement = React.createElement;

		React.createElement = function (type, props, ...children) {
			var reactEl = _createElement.apply(this, [type, props].concat(children));

			if(reactEl._owner && reactEl._owner._instance){
				addComponent(reactEl._owner._instance);
			}

			return reactEl;
		};
	}
	checkAndReport(document.body, timeout);
};

module.exports = reactAxe;
