(function(angular) {
  "use strict";

  // service support 
  angular.mock.service = (function() {
    
    var regexpUrl = function(regexp) {
      return {
        test: function(url) {
          this.matches = url.match(regexp);
          return this.matches && this.matches.length > 0;
        }
      };
    };

    //---

    var instance;

    var ClassDef = function() {
      if ( instance )
        return instance;
      instance = this;
    };

    ClassDef.prototype.config = function(angular, httpBackend) {
      configJSONP(httpBackend);
      configResources(angular, httpBackend);
    };

    //---

    var configJSONP = function(httpBackend) {
      // Allow JSONP to pass to external services (ie Solr) 
      httpBackend.when('JSONP', regexpUrl(/http:\/\/.*/)).passThrough();
    };

    //---

    var resources = [];

    ClassDef.addResource = function(resource) {
      if(resource) resources.push(resource);
    };

    var configResources = function(angular, httpBackend) {
      var i = (resources.length - 1);
      
      while(i > -1) {
        resources[i--](angular, httpBackend, regexpUrl);
      }

    };

    //---

    return ClassDef;

  })();

  //---

  angular.module('app.mock', []);

  //---

  angular.module('app.mock').service('MockService', angular.mock.service);

  //---

  // provider

    // You can also just use provide to blanket replace $httpBackend 
    // with the mock
  angular.module('app.mock').config(

    ['$provide', 

  function($provide) {

    // Decorate by passing in the constructor for mock $httpBackend
    $provide.decorator('$httpBackend', createHttpBackendMock);

  }]);

  //---

  // run

    // Mark urls that match regexp as a match,
    // you can pass this as the url argument to $httpBackend.[when|expect]
  angular.module('app.mock').run(

    ['$httpBackend', '$timeout', 'MockService',

  function($httpBackend, $timeout, MockService) {

    MockService.config(angular, $httpBackend);

    //---

    // A "run loop" of sorts to get httpBackend to 
    // issue responses and trigger the client code's callbacks
    var flushBackend = function() {
      try {
        $httpBackend.flush();
      } catch (err) {
        // ignore that there's nothing to flush
      }
      $timeout(flushBackend, 500);
    };
    $timeout(flushBackend, 500);

  }]);

})(window.angular);