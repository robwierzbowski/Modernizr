/* jshint node: true */
'use strict';

// Generates configuration object for rjs.
// input: String of a grunt init file
// dest: output file destination
// min: whether to output a minified/uglified file
module.exports = function rjsConfig(input, dest, min) {
  var path = require('path');

  var config = {
    baseUrl: path.join(__dirname, '../src'),
    rawText: {
      'modernizr-init': input
    },
    name: 'modernizr-init',
    out: dest,
    wrap: {
      start: ';(function(window, document, undefined){',
      end: '})(this, document);'
    },
    optimize: 'none',
    onBuildWrite: function (id, path, contents) {
      if ((/define\(.*?\{/).test(contents)) {
        // Remove AMD ceremony for use without require.js or almond.js
        contents = contents.replace(/define\(.*?\{/, '');
        contents = contents.replace(/\}\);\s*?$/,'');

        if (!contents.match(/Modernizr\.addTest\(/) && !contents.match(/Modernizr\.addAsyncTest\(/)) {
          // Remove last return statement and trailing })
          contents = contents.replace(/return.*[^return]*$/,'');
        }
      }
      else if ((/require\([^\{]*?\{/).test(contents)) {
        contents = contents.replace(/require[^\{]+\{/, '');
        contents = contents.replace(/\}\);\s*$/,'');
      }
      return contents;
    }
  };

  // For minified output
  if (min) {
    config.optimize = 'uglify2';
    config.preserveLicenseComments = false;
    config.uglify2 = {
      mangle: {
        except: ['Modernizr']
      }
    };
  }

  return config;
};
