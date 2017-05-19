'use strict';

angular.module('its110App')
  .directive('background', function() {
    return {
      templateUrl: 'app/lessons/background/background.html',
      restrict: 'EA',
      link: function(scope, element, attrs) {}
    };
  });
