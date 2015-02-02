'use strict';

angular.module('its110App')
  .directive('userProgress', function () {
    return {
      templateUrl: 'app/lessons/userProgress/userProgress.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      	//element.addClass('progress-box');
      }
    };
  });