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
  var rjsConfig = require('./config-require');
  var generateInit = require('./generate-init');
  var banners = require('./banners');

  config = config || require('./config-modernizr.json');

  var outputFilePath = path.join(__dirname, '../dist/modernizr-build.js');
  var min = false; //// Temporary stub for min output

  // White noise suppression
  //// This is all in API test, something for travis. Should expose in a
  //// better way, add to docs.
  var verbose = (config.verbose !== false);
  delete config.verbose;

  // Build and process the Modernizr file
  requirejs.optimize(rjsConfig(generateInit(config), outputFilePath, min), function (buildResponse) {
    // Post-generation alterations
    var mod = fs.readFileSync(outputFilePath, { encoding: 'utf8' });

    // Remove `define('modernizr-init' ...)`
    mod = mod.replace('define("modernizr-init", function(){});', '', 'g');

    // Hack the prefix into place. Anything is way too big for something so small.
    if (config.classPrefix) {
      mod = mod.replace('classPrefix: \'\',', 'classPrefix: \'' + config.classPrefix.replace(/"/g, '\\"') + '\',');
    }

    // Add banner
    var banner = min ? banners().compact : banners().full;
    mod = banner + mod;

    // Write back to the file system
    fs.writeFileSync(outputFilePath, mod);
  }, function(err) {
    console.log(err);
  });

  //// Re impliment verbose for logging
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
