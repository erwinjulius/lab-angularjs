define(
// require.js dependency injection
[
  'angular',
  'angularRoute',
  'angularResource'
], 

// require.js module scope
function(ng) {
  'use strict';


  var module = ng.module(
    // module name
    'home', 

    // module dependencies
    [
      'ngRoute', 
      'ngResource'
    ]
  ); 

  return module;


});