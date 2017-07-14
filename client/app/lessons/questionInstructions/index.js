import angular from 'angular';

import template from './question-instructions.html';
import './questionInstructions.css';

export default angular.module('bitfit.lessons.instructions', [])
  .directive('questionInstructions', function () {
    return {
      template: template,
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  }).name;