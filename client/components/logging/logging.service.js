'use strict';

angular.module('its110App')
  .factory('logging', function () {

    // Public API
    return {
      log: function (obj) {
        return $http.post('/api/logger/', obj);
      }
    };
  });
