/* jshint node: true */
'use strict';

// Usage:
// require('modernizr').build(config, callback);
//
// Where:
// dest - String, path and name of output file
// config - A JSON object of config options (see ./lib/config-modernizr.json)
// min - Bool, whether to output minified code
// callback - A callback function once build completes
module.exports = function build(dest, config, min, callback) { //// Should min be in config?
  var fs = require('fs');
  var path = require('path');
  var mkdirp = require('mkdirp');
  var requirejs = require('requirejs');
  var generateInit = require('./generate-init');
  var banners = require('./banners');

  // Defaults?
  dest = dest || '~/some/path/mod.bld.js'; //// Obvs not this //// path.join(__dirname, '../dist/modernizr-build.js');
  config = config || require('./config-modernizr.json');
  min = min || false; //// Temporary stub for min output

  // White noise suppression
  //// This is all in API test, something for travis. Should expose in a
  //// better way, add to docs.
  var verbose = (config.verbose !== false);
  delete config.verbose;

// ---------------------------------------------------------

  var rjsConfig = {
    baseUrl: path.join(__dirname, '../src'),
    rawText: {
      'modernizr-init': generateInit(config)
    },
    name: 'modernizr-init',
    out: dest,
    wrap: {
      start: ';(function(window, document, undefined){',
      end: '})(this, document);'
    },
    optimize: min ? 'uglify2' : 'none',
    onBuildWrite: function (id, path, contents) {
      //// Can we add this as a named funct?
      // Remove AMD ceremony for use without require.js or almond.js
      if ((/define\(.*?\{/).test(contents)) {
        contents = contents.replace(/define\(.*?\{/, '');
        contents = contents.replace(/\}\);\s*?$/,'');
        if (!contents.match(/Modernizr\.addTest\(/) && !contents.match(/Modernizr\.addAsyncTest\(/)) {
          contents = contents.replace(/return.*[^return]*$/,'');
        }
      }
      //// Add wha this is?
      else if ((/require\([^\{]*?\{/).test(contents)) {
        contents = contents.replace(/require[^\{]+\{/, '');
        contents = contents.replace(/\}\);\s*$/,'');
      }
      return contents;
    },

    preserveLicenseComments: min ? false : true,
    uglify2: min ? { mangle: { except: ['Modernizr'] }} : null //// Is this totally ugly?
  };

// ---------------------------------------------------------

  // Build and process the Modernizr file
  requirejs.optimize(rjsConfig, function (buildResponse) {
    // Post-generation alterations
    var mod = fs.readFileSync(dest, { encoding: 'utf8' });

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
    fs.writeFileSync(dest, mod);
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
