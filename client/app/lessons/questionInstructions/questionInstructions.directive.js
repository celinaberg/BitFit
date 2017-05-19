'use strict';

angular.module('its110App')
  .directive('questionInstructions', function() {
    return {
      templateUrl: 'app/lessons/questionInstructions/question-instructions.html',
      restrict: 'EA',
      link: function(scope, element, attrs) {}
    };
  });
