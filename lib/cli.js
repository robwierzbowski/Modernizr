#!/usr/bin/env node
/* jshint node: true */

// --config (path to config.json). No config builds the whole lib.

'use strict';
var nopt = require('nopt');
var path = require('path');
var modernizr = require(path.resolve(__dirname, 'build'));

var opts = nopt({
  config: [path, null],
  dest: [path, null],
  min: [Boolean, null],
  verbose: [Boolean, null]
}, {
  c: '--config',
  d: '--dest',
  m: '--min',
  v: '--verbose'
});

// Parse config file to object
var configPath = opts.config ||  path.resolve(__dirname, 'config-modernizr.json');
var config = require(configPath);

// Build options object
var options = {};

if (opts.dest !== undefined) {
  options.dest = opts.dest;
}
if (opts.min !== undefined) {
  options.min = opts.min;
}
if (opts.verbose !== undefined) {
  options.verbose = opts.verbose;
}

// Run modernizr build
modernizr(config, options);
