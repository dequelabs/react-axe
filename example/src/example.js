var React = require('react');
var ReactDOM = require('react-dom');

var ServiceChooser = require('./serviceChooser');

var axe = require('../../index.js');

if (process.env.NODE_ENV !== 'production') {
	axe(React, ReactDOM, 1000);
}

var services = [
	{ name: 'Web Development', price: 300 },
	{ name: 'Design', price: 400 },
	{ name: 'Integration', price: 250 },
	{ name: 'Training', price: 220 }
];

// Render the ServiceChooser component, and pass the array of services

ReactDOM.render(
	<ServiceChooser items={ services } />,
	document.getElementById('container')
);
