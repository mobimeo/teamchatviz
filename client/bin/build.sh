#!/bin/bash

rm -rf dist
mkdir dist
cp index.prod.html dist/index.html
# jspm install
jspm bundle client.js app-bundle.js --minify --skip-source-maps
cp app-bundle.js dist/
cp jspm_packages/system*.js dist/
cp jspm.browser.prod.js dist/jspm.browser.js
cp jspm.config.js dist/jspm.config.js
cp -R images dist/images;