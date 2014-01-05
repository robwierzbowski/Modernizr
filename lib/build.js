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
  var cwd = process.cwd();
  var path = require('path');
  var cp = require('child_process');
  var configAll = require('./config-all.json');
  var generateInit = require('./generate-init');
  var mkdirp = require('mkdirp');
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

  // Temporarily change working dir to Modernizr root
  var localRoot = path.join(__dirname, '..');
  process.chdir(localRoot);

  // Context-sensitive requires
  var grunt = require('grunt');

  // So we don't make path assumptions, we load the current Gruntfile
  require(path.join(localRoot, 'Gruntfile'))(grunt);

  // and store our config options for later use.
  var settings = grunt.config();

  var gruntBuild = cp.spawn(__dirname + '/../node_modules/.bin/' + 'grunt', ['build'], {
    stdio: verbose ? 'inherit' : [0, 'pipe', 2],
    cwd: localRoot
  });

  gruntBuild.on('exit', function (code) {

    // Ensure uglify is defined
    var uglify = (settings.uglify || {}).dist || {};

    // Read concat / minified source
    var source, dest;

    if (uglify.src && fs.existsSync(uglify.src[0])) {
      source = grunt.file.read(uglify.src[0]);
    }

    if (uglify.dest && fs.existsSync(uglify.dest)) {
      dest = grunt.file.read(uglify.dest);
    }

    // Switch working directory back to original
    process.chdir(cwd);

    // If callback is defined, invoke it
    if (typeof callback === 'function') {
      callback({
        code: source,
        min: dest
      });
    } else {
      return process.exit(code);
    }
  });
};
