# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.5.2](https://github.com/dequelabs/react-axe/compare/v3.5.1...v3.5.2) (2020-06-19)

### [3.5.1](https://github.com/dequelabs/react-axe/compare/v3.5.0...v3.5.1) (2020-06-19)

### Bug Fixes

- explicitly include dist files in npm tarball ([#158](https://github.com/dequelabs/react-axe/issues/158)) ([6bd3ddf](https://github.com/dequelabs/react-axe/commit/6bd3ddfcfd1fb621d95096b10becc7bf72123f02))
- **build:** don't ignore dist direcotry ([#155](https://github.com/dequelabs/react-axe/issues/155)) ([3771b26](https://github.com/dequelabs/react-axe/commit/3771b262df4e8919f5370d1d45ae1ebdd608ca73))
- **build:** don't ignore dist direcotry ([#155](https://github.com/dequelabs/react-axe/issues/155)) ([647ac6f](https://github.com/dequelabs/react-axe/commit/647ac6f8a278d7c83b27b6556bd34b0e84018934))

## [3.5.0](https://github.com/dequelabs/react-axe/compare/v3.4.1...v3.5.0) (2020-06-16)

### Features

- convert to typescript ([#137](https://github.com/dequelabs/react-axe/issues/137)) ([261d358](https://github.com/dequelabs/react-axe/commit/261d3584a5fcfbf182a215fee3e824f996e0e669))

### Bug Fixes

- 4.5:1 ratio for devtool colors in both light and dark theme ([#142](https://github.com/dequelabs/react-axe/issues/142)) ([35a3f4d](https://github.com/dequelabs/react-axe/commit/35a3f4d523a44375ad30a45bc6adebc48280acb3))
- fire checkNode on leading edge ([#147](https://github.com/dequelabs/react-axe/issues/147)) ([055dc2b](https://github.com/dequelabs/react-axe/commit/055dc2b13ffbb7e991ae7cc8a18b5ae4b11b3919))

### [3.4.1](https://github.com/dequelabs/react-axe/compare/v3.4.0...v3.4.1) (2020-02-14)

### Bug Fixes

- **debounce:** make 3rd parameter a true debounce ([0503d5f](https://github.com/dequelabs/react-axe/commit/0503d5f1e17a1db6ad8f205ee122c4598755738b))

## [3.4.0](https://github.com/dequelabs/react-axe/compare/v3.3.0...v3.4.0) (2020-02-11)

### Features

- Support Axe-core context param ([#127](https://github.com/dequelabs/react-axe/issues/127)) ([c37fc18](https://github.com/dequelabs/react-axe/commit/c37fc1891049f34586555420ccf6dddf2b51008c))

## [3.3.0](https://github.com/dequelabs/react-axe/compare/v3.0.1...v3.3.0) (2019-08-28)

### Bug Fixes

- addComponent was getting called for the same component multiple times causing after.js to get stuck in an infinite loop ([d5901f3](https://github.com/dequelabs/react-axe/commit/d5901f3))
- catch and log errors thrown when calling React.findDOMNode ([#82](https://github.com/dequelabs/react-axe/issues/82)) ([14eeec6](https://github.com/dequelabs/react-axe/commit/14eeec6))
- include node tested to its path when determining commonParent ([31e13e4](https://github.com/dequelabs/react-axe/commit/31e13e4))
- look for debug id under the fibre if not in the internal instance ([#65](https://github.com/dequelabs/react-axe/issues/65)) ([e246a24](https://github.com/dequelabs/react-axe/commit/e246a24))
- use reactInstance variable when possible ([eafb2e3](https://github.com/dequelabs/react-axe/commit/eafb2e3))
- **example:** correctly mount shadow DOM ([#88](https://github.com/dequelabs/react-axe/issues/88)) ([528e153](https://github.com/dequelabs/react-axe/commit/528e153))
- **package:** update react-shadow to version 17.0.0 ([#83](https://github.com/dequelabs/react-axe/issues/83)) ([98b3cb9](https://github.com/dequelabs/react-axe/commit/98b3cb9))

### Features

- use `requestIdleCallback` when possible ([#61](https://github.com/dequelabs/react-axe/issues/61)) ([a9bff13](https://github.com/dequelabs/react-axe/commit/a9bff13)), closes [#59](https://github.com/dequelabs/react-axe/issues/59) [#59](https://github.com/dequelabs/react-axe/issues/59)

## [3.2.0](https://github.com/dequelabs/react-axe/compare/v3.0.1...v3.2.0) (2019-06-26)

### Bug Fixes

- addComponent was getting called for the same component multiple times causing after.js to get stuck in an infinite loop ([d5901f3](https://github.com/dequelabs/react-axe/commit/d5901f3))
- catch and log errors thrown when calling React.findDOMNode ([#82](https://github.com/dequelabs/react-axe/issues/82)) ([14eeec6](https://github.com/dequelabs/react-axe/commit/14eeec6))
- include node tested to its path when determining commonParent ([31e13e4](https://github.com/dequelabs/react-axe/commit/31e13e4))
- look for debug id under the fibre if not in the internal instance ([#65](https://github.com/dequelabs/react-axe/issues/65)) ([e246a24](https://github.com/dequelabs/react-axe/commit/e246a24))
- use reactInstance variable when possible ([eafb2e3](https://github.com/dequelabs/react-axe/commit/eafb2e3))
- **example:** correctly mount shadow DOM ([#88](https://github.com/dequelabs/react-axe/issues/88)) ([528e153](https://github.com/dequelabs/react-axe/commit/528e153))
- **package:** update react-shadow to version 17.0.0 ([#83](https://github.com/dequelabs/react-axe/issues/83)) ([98b3cb9](https://github.com/dequelabs/react-axe/commit/98b3cb9))

### Features

- use `requestIdleCallback` when possible ([#61](https://github.com/dequelabs/react-axe/issues/61)) ([a9bff13](https://github.com/dequelabs/react-axe/commit/a9bff13)), closes [#59](https://github.com/dequelabs/react-axe/issues/59) [#59](https://github.com/dequelabs/react-axe/issues/59)

# [3.1.0](https://github.com/dequelabs/react-axe/compare/v3.0.1...v3.1.0) (2019-03-11)

### Bug Fixes

- look for debug id under the fibre if not in the internal instance ([#65](https://github.com/dequelabs/react-axe/issues/65)) ([e246a24](https://github.com/dequelabs/react-axe/commit/e246a24))

### Features

- use `requestIdleCallback` when possible ([#61](https://github.com/dequelabs/react-axe/issues/61)) ([a9bff13](https://github.com/dequelabs/react-axe/commit/a9bff13)), closes [#59](https://github.com/dequelabs/react-axe/issues/59) [#59](https://github.com/dequelabs/react-axe/issues/59)

<a name="3.0.2"></a>

## [3.0.2](https://github.com/dequelabs/react-axe/compare/v3.0.1...v3.0.2) (2018-09-17)

### Bug Fixes

- use reactInstance variable when possible ([eafb2e3](eafb2e3b2356e54996c3eca106ba05505b91c4e7))
- addComponent was getting called for the same component multiple times causing after.js to get stuck in an infinite loop ([d5901f3](d5901f3b639c4cf2b0ed69e1d22cfe45ede088a1))

<a name="3.0.1"></a>

## [3.0.1](https://github.com/dequelabs/react-axe/compare/v3.0.0...v3.0.1) (2018-04-05)

### Bug Fixes

- use a semaphore to avoid running axe concurrently ([#33](https://github.com/dequelabs/react-axe/issues/33)) ([151c906](https://github.com/dequelabs/react-axe/commit/151c906)), closes [#32](https://github.com/dequelabs/react-axe/issues/32)

<a name="3.0.0"></a>

# [3.0.0](https://github.com/dequelabs/react-axe/compare/v3.0.0-alpha.1...v3.0.0) (2018-03-28)

### Features

- Simplified the example by removing Grunt ([#30](https://github.com/dequelabs/react-axe/issues/30)) ([311d2e5](https://github.com/dequelabs/react-axe/commit/311d2e5)), closes [#29](https://github.com/dequelabs/react-axe/issues/29)

<a name="3.0.0-alpha.1"></a>

# [3.0.0-alpha.1](https://github.com/dequelabs/react-axe/compare/v2.1.9...v3.0.0-alpha.1) (2018-02-20)

### Features

- add integration testing with Cypress ([10bfda6](https://github.com/dequelabs/react-axe/commit/10bfda6))
- add support for react 16 ([f9de57d](https://github.com/dequelabs/react-axe/commit/f9de57d)), closes [#26](https://github.com/dequelabs/react-axe/issues/26)
- make react-axe return a promise ([1d4bd8d](https://github.com/dequelabs/react-axe/commit/1d4bd8d))
- upgrade to axe 3 ([87e6d1e](https://github.com/dequelabs/react-axe/commit/87e6d1e)), closes [#22](https://github.com/dequelabs/react-axe/issues/22)

<a name="2.1.9"></a>

## [2.1.9](https://github.com/dequelabs/react-axe/compare/v2.1.8...v2.1.9) (2017-12-20)

<a name="2.1.8"></a>

## [2.1.8](https://github.com/dequelabs/react-axe/compare/2.1.6...v2.1.8) (2017-12-20)

<a name="2.1.6"></a>

## [2.1.6](https://github.com/dequelabs/react-axe/compare/2.1.5...2.1.6) (2017-06-10)

<a name="2.1.5"></a>

## [2.1.5](https://github.com/dequelabs/react-axe/compare/2.1.4...2.1.5) (2017-06-05)

<a name="2.1.4"></a>

## [2.1.4](https://github.com/dequelabs/react-axe/compare/2.1.2...2.1.4) (2017-05-25)

<a name="2.1.2"></a>

## 2.1.2 (2017-05-01)
