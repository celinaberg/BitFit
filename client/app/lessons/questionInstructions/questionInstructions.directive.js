'use strict';
angular.module('bitfit').directive('questionInstructions', function () {
  return {
    templateUrl: 'app/lessons/questionInstructions/question-instructions.html',
    restrict: 'EA',
    link: function (scope, element, attrs) {
    }
  };
});