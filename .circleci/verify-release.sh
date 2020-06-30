#!/bin/bash
if [ ! -z "$1" ] && [ $1 = 'post' ]
then
  # verify the released npm package in another dir as we can't
  # install a package with the same name
  version=$(node -pe "require('./package.json').version")
  name=$(node -pe "require('./package.json').name")

  mkdir "verify-release-$version"
  cd "verify-release-$version"
  npm init -y
  npm install "$name@$version"
  node -pe "window={}; document={}; require('$name')"

  cd "node_modules/${name}"
else
  # verify main file exists
  main=$(node -pe "require('./package.json').main")
  node -pe "window={}; document={}; require('./$main')"
fi

if [ $? != 0 ]
then
  exit 1;
fi

# Test if typescript file exists (if declared)
types=$(node -pe "require('./package.json').types")
if [ $types = undefined ]
then
  types=$(node -pe "require('./package.json').typings")
fi

if [ $types != undefined ] && [ ! -f "$types" ]
then
  echo "types file missing"
  exit 1;
fi