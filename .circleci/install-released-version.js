#!/usr/bin/env node

const fs = require('fs');
const pkg = require('../package.json');
const { execSync } = require('child_process');
const name = pkg.name;

// install version by changing the name of the current package
pkg.name = 'post-verify-release';
pkg.originalName = name;
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
execSync(`npm install --no-save ${name}@${pkg.version}`);
