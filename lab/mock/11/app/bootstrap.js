define(
// require.js dependency injection
[
  'angular',

  './mock/require.load',
  './main/require.load'
], 

// require.js module scope
function(ng) {
  'use strict';

  console.log('bootstrap application');

  // define run module to bootstrap application
  ng.module(
    // module name
    'run',

    // module dependencies
    [
      'ngMockBackend',
      'main'      
    ]
  );

  // start angular app
  ng.bootstrap(document, ['run']);

});