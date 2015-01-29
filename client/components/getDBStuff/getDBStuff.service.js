'use strict';

angular.module('its110App')
  .factory('GetDBStuff', function ($resource) {
    return $resource('/api/backgrounds/:controller', 
    {
      getBackground: {
        method: 'GET',
        params: {
          controller:'getBackground'
        }
      }
    
    // Service logic
    // ...

    //var meaningOfLife = 42;

    // Public API here
    //return {
    //  someMethod: function () {
    //    return meaningOfLife;
    //  }
    });
  });
