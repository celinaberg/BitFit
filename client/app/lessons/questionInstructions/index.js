import angular from 'angular'

import template from './question-instructions.html'
import './questionInstructions.css'
import angularUiBootstrap from 'angular-ui-bootstrap'

export default angular.module('bitfit.lessons.instructions', ['ui.bootstrap'])
  .directive('questionInstructions', () => ({
    template,
    restrict: 'EA',
    link (scope, element, attrs) {
    }
  })).name
