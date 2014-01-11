#!/usr/bin/env node
/* jshint node: true */
'use strict';

// Expose a nice cli to the user.
// Usage:
//   $ modernizr
//   $ modernizr --config ./my-config.json --dest ./build/modernizr-build.js --min
//   $ modernizr -c ./my-config.json --d ./build/modernizr-build.js -m
// Arguments:
//   See `help` variable.

var nopt = require('nopt');
var path = require('path');
var modernizr = require(path.resolve(__dirname, 'modernizr'));

var opts = nopt({
  config: [path, null],
  dest: [path, null],
  min: [Boolean, null],
  verbose: [Boolean, null],
  help: [Boolean, null]
}, {
  c: '--config',
  d: '--dest',
  m: '--min',
  v: '--verbose',
  h: '--help'
});

if (opts.help) {
  var help = '\n' +
    '  Modernizr Build CLI\n\n' +
    '  --config, -c: Path to a JSON file containing Modernizr configuration.\n' +
    '    See lib/config-all.json for an example. If you don\'t provide\n' +
    '    a configuration file Modernizr will output a development build with\n' +
    '    all feature detects.\n\n' +
    '  --dest, -d: Path to write the build file to.\n\n' +
    '  --min, -m: Minify the output file.\n\n' +
    '  --verbose, -v: Show verbose output.\n\n' +
    '  --help, -h: Show help.\n';

  console.log(help);
}
else {
  // Parse config file to object
  var configPath = opts.config ||  path.resolve(__dirname, 'config-all.json');
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
  modernizr.build(config, options);
}
