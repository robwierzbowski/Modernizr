/* jshint node: true */
'use strict';

// Usage:
// require('modernizr').build(config, callback);
//
// Where:
// config - A JSON object of config options (see ./lib/config-modernizr.json)
// callback - A callback function once build completes
module.exports = function build(config, callback) {
  var fs = require('fs');
  var path = require('path');
  var mkdirp = require('mkdirp');
  var requirejs = require('requirejs');
  var generateInit = require('./generate-init');
  var configRequire = require('./config-require');
  var configAll = require('./config-modernizr.json');

  var tmpDir = path.join(__dirname, '../', 'tmp');

  config = config || configAll;

  // Write init file
  mkdirp(tmpDir);
  fs.writeFileSync(path.join(tmpDir, 'modernizr-init.js'), generateInit(config));

  // White noise suppression
  //// This is all in API test, something for travis. Should expose in a
  //// better way, add to docs.
  var verbose = (config.verbose !== false);
  delete config.verbose;

  // REQUIRE!!!
  requirejs.optimize(configRequire(path.join(__dirname, '../dist/modernizr-build.js'), false), function (buildResponse) {
    //// Have to get in here somehow, nor registering right now.
    var contents = fs.readFileSync(config.out, 'utf8');
    console.log('The contents');
    console.log(contents);
  }, function(err) {
    console.log(err);
  });

  //// Re impliment verbose for logging

  //// Uglify can be require js

  //// I think here we need the function still to expose the code output
  //   // If callback is defined, invoke it
  //   if (typeof callback === 'function') {
  //     callback({
  //       code: expanded_code,
  //       min: uglified_code
  //     });
  //   } else {
  //     return process.exit(code);
  //   }
  // });
};
