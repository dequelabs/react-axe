# React-axe

Test your React application with the [axe-core](https://github.com/dequelabs/axe-core) accessibility testing library. Results will show in the Chrome DevTools console.

## Usage

[![Greenkeeper badge](https://badges.greenkeeper.io/dequelabs/react-axe.svg)](https://greenkeeper.io/)

Install the module from NPM or elsewhere

```sh
npm install --save-dev react-axe
```

## Initialize the module

Call the exported function passing in the React and ReactDOM objects as well as a timing delay in milliseconds that will be observed between each component change and the time the analysis starts.

```js
var React = require('react');
var ReactDOM = require('react-dom');

if (process.env.NODE_ENV !== 'production') {
  var axe = require('react-axe');
  axe(React, ReactDOM, 1000);
}
```

Be sure to only run the module in your development environment (as shown in the code above) or else your application will use more resources than necessary when in production. You can use [envify](https://www.npmjs.com/package/envify) to do this as is shown in the [example](./example/package.json#L35).

Once initialized, the module will output accessibility defect information to the Chrome Devtools console every time a component updates.

## Deduplicating

react-axe will deduplicate violations using the rule that raised the violation and the CSS selector and the failureSummary of the specific node. This will ensure that each unique issue will only be printed to the console once.

## Debouncing

The third argument to the exported function is the number of milliseconds to wait for component updates to cease before performing an analysis of all the changes. The changes will be batched and analyzed from the closest common ancestor of all the components that changed within the batch. This generally leads to the first analysis for a dynamic application, analyzing the entire page (which is what you want), while subsequent updates will only analyze a portion of the page (which is probably also what you want).

## Shadow DOM

With version 3.0.0, react-axe now runs accessibility tests inside of open Shadow DOM. You don't have to do anything special other than run react-axe on an component encapsulated with open Shadow DOM (as opposed to closed). For more information, see the [axe-core repo](https://github.com/dequelabs/axe-core).

## Configuration

There is a fourth optional argument that is a configuration object for axe-core. Read about the object here: https://github.com/dequelabs/axe-core/blob/master/doc/API.md#api-name-axeconfigure

```js
var config = {
  rules: [
    {
      id: 'skip-link',
      enabled: true
    }
  ]
};

axe(React, ReactDOM, 1000, config);
```

Axe-core's context object can be given as a fifth optional argument to specify which element should (and which should not) be tested. Read more from the Axe-core documentation: https://github.com/dequelabs/axe-core/blob/master/doc/API.md#context-parameter

```js
var context = {
  include: [['#preview']]
};

axe(React, ReactDOM, 1000, undefined, context);
```

## Run the example

Run a build in the example directory and start a server to see React-aXe in action in the Chrome Devtools console (opens on localhost:8888):

```sh
npm install
cd example
npm install
npm install -g http-server
npm start
```

## Run the tests

Install dependencies in the root directory (which also installs them in the example directory) and then run the tests:

```
npm install
npm test
```

To debug tests in the Cypress application:

```
npm run test:debug
```

## Compatibility

react-axe uses advanced console logging features and works best in the Chrome browser, with limited functionality in Safari and Firefox.

## Advantages

I have been asked how this is different from modules like react-a11y which test the jsx.

The main difference is that react-axe tests the accessibility of the rendered DOM. This is important because many accessibility issues exist at the intersection of the DOM and the CSS and unless you have a fully rendered DOM, you will get two sorts of inaccuracies:

1. False negatives because of lacking information. Example is in order to test color contrast you must know the foreground and background colors, and
1. False positives because the element being evaluated is not in its final state and the information to communicate this to the testing algorithm is not available. Example is an inert piece of code that will be augmented once it becomes active.

If you have nice clean code, number 2 will be negligible but number 1 will always be a concern.
