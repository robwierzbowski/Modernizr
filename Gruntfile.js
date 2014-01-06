/*jshint node: true */
/*global module */
module.exports = function( grunt ) {
  'use strict';

  var modConfig = grunt.file.readJSON('lib/config-modernizr.json');
  var browsers = grunt.file.readJSON('test/sauce-browsers.json');

  // Load grunt dependencies
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
    },
    qunit: {
      files: ['test/index.html']
    },
    nodeunit: {
      files: ['test/api/*.js']
    },
    stripdefine: {
      build: ['dist/modernizr-build.js']
    },
    uglify: {
      options: {
        stripbanners: true,
        banner: '<%= banner.compact %>',
        mangle: {
          except: ['Modernizr']
        },
        beautify: {
          ascii_only: true
        }
      },
      dist: {
        src: ['dist/modernizr-build.js'],
        dest: 'dist/modernizr-build.min.js'
      }
    },
    watch: {
      files: '<%= jshint.files %>',
      tasks: 'jshint',
      tests: {
        files: '<%= jshint.tests.files.src %>',
        tasks: [
          'jshint:tests',
          'qunit'
        ]
      }
    },
    jshint: {
      options: {
        boss: true,
        browser: true,
        curly: false,
        devel: true,
        eqeqeq: false,
        eqnull: true,
        expr: true,
        evil: true,
        immed: false,
        laxcomma: true,
        newcap: false,
        noarg: true,
        quotmark: 'single',
        smarttabs: true,
        sub: true,
        trailing: true,
        undef: true,
        unused: true,
        globals: {
          Modernizr: true,
          DocumentTouch: true,
          TEST: true,
          SVGFEColorMatrixElement: true,
          Blob: true,
          define: true,
          require: true
        },
        ignores: [
          'src/load.js',
          'src/require.js'
        ]
      },
      files: [
        'Gruntfile.js',
        'src/*.js',
        'feature-detects/**/*.js'
      ],
      tests: {
        options: {
          jquery: true,
          globals: {
            Modernizr: true,
            TEST: true,
            QUnit: true
          }
        },
        files: {
          src: ['test/js/*.js']
        }
      },
      lib: {
        options: {
          node: true
        },
        files: {
          src: ['lib/*.js']
        }
      }
    },
    clean: {
      dist: ['dist'],
      postbuild: [
        'build',
        'tmp'
      ]
    },
    connect: {
      server: {
        options: {
          base: '',
          port: 9999
        }
      }
    },
    'saucelabs-qunit': {
      all: {
        options: {
          urls: ['http://127.0.0.1:9999/test/basic.html'],
          tunnelTimeout: 5,
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 2,
          browsers: browsers,
          testname: 'qunit tests',
          tags: [
            'master',
            '<%= pkg.version %>'
          ]
        }
      }
    }
  });

  // Strip define fn
  grunt.registerMultiTask('stripdefine', 'Strip define call from dist file', function() {
    this.filesSrc.forEach(function(filepath) {
      // Remove `define('modernizr-init' ...)` and `define('modernizr-build' ...)`
      var mod = grunt.file.read(filepath).replace(/define\("modernizr-(init|build)", function\(\)\{\}\);/g, '');

      // Hack the prefix into place. Anything is way too big for something so small.
      if ( modConfig && modConfig.classPrefix ) {
        mod = mod.replace('classPrefix : \'\',', 'classPrefix : \'' + modConfig.classPrefix.replace(/"/g, '\\"') + '\',');
      }
      grunt.file.write(filepath, mod);
    });
  });

  // Testing tasks
  grunt.registerTask('test', ['jshint', 'build', 'qunit', 'nodeunit']);

  // Sauce labs CI task
  grunt.registerTask('sauce', ['connect','saucelabs-qunit']);

  // Travis CI task.
  grunt.registerTask('travis', ['test']);

  // Build
  grunt.registerTask('build', [
    'clean:dist',
    'stripdefine',
    'uglify',
    // 'clean:postbuild' //// Gruntfile is temporarily broken, must run as node package.
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);
};
