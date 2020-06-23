#!/usr/bin/env node

const fs = require('fs');
const pkg = require('../package.json');
const path = require('path');

// use the installed version for post-verify or the current version for pre-verify
const name = pkg.originalName || pkg.name;
const dir =
  pkg.name === 'post-verify-release' ? `./node_modules/${name}` : './';

// confirm main file exists
if (!fs.existsSync(path.join(dir, pkg.main))) {
  throw new Error('"package.main" file does not exist');
}

// confirm declared files exist
if (pkg.files) {
  pkg.files.forEach(file => {
    if (!fs.existsSync(path.join(dir, file))) {
      throw new Error(`"package.files['${file}']" file does not exist`);
    }
  });
}

// confirm types file exists
const types = pkg.types || pkg.typings;
if (types && !fs.existsSync(path.join(dir, types))) {
  throw new Error('"package.types" or "package.typings" file does not exist');
}
