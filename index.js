var axeCore = require('axe-core');

var boldCourier = 'font-weight:bold;font-family:Courier;';
var smallDefault = 'font-family:Menlo, monospace;font-size:x-small;';
var critical = 'color:red;font-weight:bold;'
var serious = 'color:red;font-weight:normal;'
var moderate = 'color:orange;font-weight:bold;'
var minor = 'color:orange;font-weight:normal;'
var defaultReset = 'font-color:black;font-weight:normal;'
var timer;
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
		axe.a11yCheck(n, { reporter: 'v1' },function (results) {
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
							console.log('Selector: %c%s',
							boldCourier, node.target.toString());
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

var _createClass;
function audit(r, rd, timeout, conf) {
	if (!_createClass) {
		if (conf) {
			axeCore.configure(conf);
		}

		_createClass = r.createClass;
		r.createClass = function (...args) {
			args[0]._componentDidMount = args[0].componentDidMount;
			args[0].componentDidMount = function () {
				if (this._componentDidMount) {
					this._componentDidMount.apply(this, arguments);
				}
				checkAndReport(rd.findDOMNode(this), timeout)
			};
			args[0]._componentDidUpdate = args[0].componentDidUpdate;
			args[0].componentDidUpdate = function () {
				if (this._componentDidUpdate) {
					this._componentDidUpdate.apply(this, arguments);
				}
				checkAndReport(rd.findDOMNode(this), timeout)
			};
			var retVal = _createClass.apply(this, args);
			return retVal;
		}
	}
	checkAndReport(document, timeout);
}

module.exports = audit;

if (window && window.getComputedStyle) {
	var script = document.createElement('script');
	script.text = axeCore.source;
	document.body.appendChild(script);
}
