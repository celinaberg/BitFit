import angular from 'angular'

import template from './question-instructions.html'
import './questionInstructions.css'

export default angular.module('bitfit.lessons.instructions', [])
  .directive('questionInstructions', () => ({
    template,
    restrict: 'EA',
    link (scope, element, attrs) {
    }
  })).name
