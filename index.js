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

		axeCore.a11yCheck(n, { reporter: 'v1' },function (results) {
			results.violations = results.violations.filter(function (result) {
				result.nodes = result.nodes.filter(function (node) {
					var key = node.target.toString() + result.id + node.failureSummary;
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
						var el = document.querySelector(node.target.toString());
						console.error(node.failureSummary);
						console.log('HTML: %c%s', boldCourier, node.html);
						if (!el) {
							console.log('Selector: %c%s', boldCourier, node.target.toString());
						} else {
							console.log('Element: %o', el);
						}
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
	if (component._reactInternalInstance && !components[component._reactInternalInstance._debugID]) {
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

	_createElement = React.createElement;

	React.createElement = function (type, props) {
		for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
			children[_key - 2] = arguments[_key];
		}

		var reactEl = _createElement.apply(this, [type, props].concat(children));

		if(reactEl._owner && reactEl._owner._instance){
			addComponent(reactEl._owner._instance);
		}

		return reactEl;
	};

	checkAndReport(document.body, timeout);
};

/*reactAxe.restoreAll = function () {
	React.createElement = _createElement;
	after.restorePatchedMethods();
};*/

module.exports = reactAxe;
