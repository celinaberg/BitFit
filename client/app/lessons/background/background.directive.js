import angular from 'angular'

import template from 'background.html';
import 'background.css';

angular.module('bitfit.lessons.background')
  .directive('background', function () {
    return {
      template: template,
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
