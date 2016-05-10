# Usage

Install the module from NPM or elsewhere

```
npm install --save-dev react-axe
```

## Initialize the module

Call the exported function passing in the React and ReactDOM objects as well as a timing delay in milliseconds that will be observed between each component change and the time the analysis starts.

```
var React = require('react');
var ReactDOM = require('react-dom');
var a11y = require('react-axe');

a11y(React, ReactDOM, 1000);
```

Once initialized like this, the module will output accessibility defect information to the Chrome Devtools console every time a component updates.

## Compatibility

react-axe uses advanced console logging features and only works in the Chrome browser
