/* jshint node: true */
'use strict';

// Usage:
// require('modernizr').build(config, callback);
//
// Where:
// config - A JSON object of config options (see ./lib/config-all.json)
// callback - A callback function once build completes
module.exports = function build(config, callback) {
  var fs = require('fs');
  var path = require('path');
  var configAll = require('./config-all.json');
  var generateInit = require('./generate-init');
  var mkdirp = require('mkdirp');
  var tmpDir = path.join(__dirname, '../', 'tmp');
  var requirejs = require('requirejs');

  config = config || configAll;

  // Write init file
  mkdirp(tmpDir);
  fs.writeFileSync(path.join(tmpDir, 'modernizr-init.js'), generateInit(config));

  // White noise suppression
  //// This is all in API test, something for travis. Should expose in a
  //// better way, add to docs.
  var verbose = (config.verbose !== false);
  delete config.verbose;

  //// REQUIRE!!!
  var rjsConfig = {
   baseUrl: path.join(__dirname, '../src'),
    paths: {
      'modernizr-init': path.join(__dirname, '../tmp/modernizr-init')
    },
    optimize: 'none',
    name: 'modernizr-init',
    out: path.join(__dirname, '../dist/modernizr-build.js'),
    wrap: {
      start: '/*THIS DAMN BANNER*/' + '\n;(function(window, document, undefined){',
      // start: '<%= banner.full %>' + '\n;(function(window, document, undefined){',
      end: '})(this, document);'
    },
    onBuildWrite: function (id, path, contents) {
      if ((/define\(.*?\{/).test(contents)) {
        //Remove AMD ceremony for use without require.js or almond.js
        contents = contents.replace(/define\(.*?\{/, '');

        contents = contents.replace(/\}\);\s*?$/,'');

        if ( !contents.match(/Modernizr\.addTest\(/) && !contents.match(/Modernizr\.addAsyncTest\(/) ) {
          //remove last return statement and trailing })
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

  requirejs.optimize(rjsConfig, function (buildResponse) {
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
