import 'webcomponents.js/webcomponents.min.js';
import React from 'react';
import ReactDOM from 'react-dom';

var GlobalHeader = require('./globalHeader');
var ServiceChooser = require('./serviceChooser');

var axe = require('../../dist/index.js');
var axeConf = {
  rules: [
    { id: 'heading-order', enabled: true },
    { id: 'label-title-only', enabled: true },
    { id: 'link-in-text-block', enabled: true },
    { id: 'region', enabled: true },
    { id: 'skip-link', enabled: true },
    { id: 'help-same-as-label', enabled: true }
  ]
};

if (process.env.NODE_ENV !== 'production') {
  axe(React, ReactDOM, 1000, axeConf);
}

var services = [
  { name: 'Web Development', price: 300 },
  { name: 'Design', price: 400 },
  { name: 'Integration', price: 250 },
  { name: 'Training', price: 220 }
];

// Render the ServiceChooser component, and pass the array of services

document.addEventListener('DOMContentLoaded', function() {
  const mountNode = document.querySelector('#container');
  mountNode &&
    ReactDOM.render(
      <div>
        <GlobalHeader />
        <ServiceChooser items={services} />
      </div>,
      mountNode
    );
});
