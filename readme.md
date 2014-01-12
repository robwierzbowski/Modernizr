# Modernizr [![Build Status](https://secure.travis-ci.org/Modernizr/Modernizr.png?branch=master)](http://travis-ci.org/Modernizr/Modernizr)

**Modernizr is a JavaScript library that detects HTML5 and CSS3 features in the user’s browser.**

- [Website](http://www.modernizr.com)
- [Documentation](http://www.modernizr.com/docs/)

Modernizr tests which native CSS3 and HTML5 features are available in the current UA and makes the results available to you in two ways: as properties on a global `Modernizr` object, and as classes on the `<html>` element. This information allows you to progressively enhance your pages based on whether the user's browser supports a particular feature or API. To see the output of all the tests Modernizr can run, visit the [test suite](http://modernizr.github.io/Modernizr/test/).

Modernizr has an optional (*not included*) conditional resource loader called `Modernizr.load()`, based on [Yepnope.js](http://yepnopejs.com). You can build a custom Modernizr file that includes `Modernizr.load()`, as well as choosing which feature tests to include on the [download page](http://www.modernizr.com/download/).

<!-- ## New Asynchronous Event Listeners

Often times people want to know when an asynchronous test is done so they can allow their application to react to it. In the past, you've had to rely on watching properties or `<html>` classes. Now you can react to asynchronus tests with the `.on` event.

The new api looks like this:

```javascript
// Listen to a test, give it a callback
Modernizr.on('testname', function( result ) {
  if (result) {
    console.log('The test passed!');
  }
  else {
    console.log('The test failed!');
  }
});
```

We guarantee that we'll only invoke your function once per time that you call `on`. We are currently not exposing the `trigger` functionality. Instead, use the `src/addTest` feature to control which async tests will expose and trigger the `on` functionality.

Only events on **asynchronous** tests are supported. Synchronous tests should be handled synchronously for speed and consistency.
 -->
## Use in a node.js project

<!-- Note: this step is not valid until Modernizr is registered with NPM -->

1. Install the package locally: `npm install --save modernizr`
2. Require and use in your node project.

#### modernizr.build(config, options)

**config** `Object`, required

A Modernizr configuration object. See [`lib/config-all.json`](lib/config-all.json) for all available options.

**options** `Object`

- **dest** `String`, `Boolean`  
    Destination path for the custom Modernizr build, or false to output nothing. Defaults to `./modernizr.js`.
- **min** `Boolean`  
    Minify the output code. Defaults to false.
- **verbose** `Boolean`  
    Output success messages. Defaults to false.
- **callback** `Function`  
    Function to run when code building is complete. An `output` argument containing a string of the built code is available.

#### Example

```js
'use strict';
var modernizr = require('modernizr');
var config = require('my-config.json');

// Write a custom Modernizr build with default settings
modernizr.build(config);

// Hide success messages, don't write a file, and assign minified output to a variable
var modernizrBuild;
modernizr.build(config, {
  min: true,
  dest: false
  verbose: false,
  callback: function (output) {
    modernizrBuild = output;
  },
});
```

## Use from the command line

You can also use the package manually from the command line.

1. Install the package globally: `npm install -g modernizr`
2. Run `modernizr` from the command line. Use `modernizr --help` to see all available options.

#### Example

```bash
# Write a development build to ./modernizr.js
$ modernizr

# Write a custom minified build to a specified location
$ modernizr --config ./my-config.json --dest ./build/modernizr-build.js --min
```

## Use with Grunt

Check out [Grunt-modernizr](https://github.com/Modernizr/grunt-modernizr)!

## Contributing

Add and improve feature tests in `feature-detects/`.  
Contribute to the Modernizr script in `src/`.  
Contribute to the build system in `lib/`.  

Take care to maintain the existing code style. Lint and test your code with Grunt.

To contribute to the the web-based build tool, see the [modernizr.com repository](https://github.com/Modernizr/modernizr.com/). 

#### Testing

To test in phantom, run `grunt test`.

To test in the browser:

1. run `grunt build`
2. run `serve .`
3. visit `<url>/test`

To see a simple build in the browser:

1. run `serve .`
2. visit  `<url>/test/modular.html`

## License

[MIT license](http://en.wikipedia.org/wiki/MIT_License)
