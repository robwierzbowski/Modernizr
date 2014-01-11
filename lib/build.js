/* jshint node: true */
'use strict';

// Usage:
// require('modernizr').build(config, options);
// require('modernizr').build(config, {
//   dest: './build/modernizr-min.js',
//   min: true,
//   callback: function (result) {
//     console.log(result.code);
//   }
// });
//
// Where:
// config - A JSON object of config options (see ./lib/config-modernizr.json)

// options:
// - dest: Specify path here to write file, or false. Default is ./modernizr.js
// - min: Bool, whether to minify code
// - verbose: output msgs/errors  // White noise suppression //// DOES NOTHING RIGHT NOW
// - callback: a callback to run at the end of the function. Has the var `code` available to it.
//// Metadata option here?

module.exports = function build(config, options) {
  var fs = require('fs');
  var path = require('path');
  var mkdirp = require('mkdirp');
  var uglifyjs = require('uglify-js');
  var requirejs = require('requirejs');
  var generateInit = require('./generate-init');
  var output;

  // Default options
  options = options || {};
  options.dest = options.dest === undefined ? 'modernizr.js' : options.dest;

  var banner = options.min ? require('./banners')('compact') : require('./banners')('full');

  // Configuration for the Require.js optimizer
  var rjsConfig = {
    baseUrl: path.join(__dirname, '../src'),
    rawText: {
      'modernizr-init': generateInit(config)
    },
    paths: {
      'test': path.join(__dirname, '../feature-detects'),
    },
    name: 'modernizr-init',
    wrap: {
      start: ';(function(window, document, undefined){',
      end: '})(this, document);'
    },
    optimize: 'none',
    onBuildWrite: function (id, path, contents) {
      // Remove AMD ceremony for use without require.js or almond.js
      if ((/define\(.*?\{/).test(contents)) {
        contents = contents.replace(/define\(.*?\{/, '');
        contents = contents.replace(/\}\);\s*?$/,'');
        if (!contents.match(/Modernizr\.addTest\(/) && !contents.match(/Modernizr\.addAsyncTest\(/)) {
          contents = contents.replace(/return.*[^return]*$/,'');
        }
      }
      else if ((/require\([^\{]*?\{/).test(contents)) {
        contents = contents.replace(/require[^\{]+\{/, '');
        contents = contents.replace(/\}\);\s*$/,'');
      }
      return contents;
    },
    out: function (text) {
      output =  text;
    },
  };

  // Build and process the Modernizr script
  requirejs.optimize(rjsConfig, function () {

    // Remove `define('modernizr-init' ...)`
    output = output.replace('define("modernizr-init", function(){});', '', 'g');

    // Hack the prefix into place. Anything is way too big for something so
    // small.
    if (config.classPrefix) {
      output = output.replace('classPrefix: \'\',', 'classPrefix: \'' + config.classPrefix.replace(/"/g, '\\"') + '\',');
    }

    // Uglify
    if (options.min) {
      output = uglifyjs.minify(output, {
        fromString: true,
        mangle: {
          except: 'Modernizr'
        }
      }).code;
    }

    // Add banner
    output = banner + output;

    // Write to the file system
    if (options.dest) {
      mkdirp(path.dirname(options.dest), function() {
        fs.writeFileSync(options.dest, output);
      });
    }

    // If callback is defined, invoke it
    if (typeof options.callback === 'function') {
      options.callback({
        code: output,
      });
    }
    else {
      return process.exit();
    }
  }, function(err) {
    console.log(err);
  });
};
