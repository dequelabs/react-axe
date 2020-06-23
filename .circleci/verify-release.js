#!/usr/bin/env node

const fs = require('fs');
const pkg = require('../package.json');
const { execSync } = require('child_process');
const path = require('path');
const name = pkg.name;
const dir = `./node_modules/${name}`;

// install version by changing the name of the current package
pkg.name = 'verify-release';
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
execSync(`npm install --no-save ${name}@${pkg.version}`);

// confirm main file exists
fs.readFileSync(path.join(dir, pkg.main), 'utf-8');

// confirm declared files exist
if (pkg.files) {
  pkg.files.forEach(file => fs.readFileSync(path.join(dir, file), 'utf-8'));
}

// confirm types file exists
const types = pkg.types || pkg.typings;
if (types) {
  fs.readFileSync(path.join(dir, types), 'utf-8');
}
