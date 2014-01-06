/* jshint node: true */
'use strict';

// Generates configuration object for rjs.
// dest: output file destination
// min: whether to output a minified/uglified file
module.exports = function rjsConfig(dest, min) {
  var path = require('path');
  var banners = require('./banners');
  var banner = min ? banners().compact : banners().full;

  var config = {
   baseUrl: path.join(__dirname, '../src'),
    paths: {
      'modernizr-init': path.join(__dirname, '../tmp/modernizr-init')
    },
    optimize: min ? 'uglify' : 'none',
    name: 'modernizr-init',
    out: dest,
    wrap: {
      start: banner + '\n;(function(window, document, undefined){',
      end: '})(this, document);'
    },
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

  return config;
};
