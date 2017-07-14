import angular from 'angular';

import template from './background.html';
import './background.css';

export default angular.module('bitfit.lessons.background', [])
  .directive('background', () => ({
    template,
    restrict: 'EA',
    link(scope, element, attrs) {
    },
  })).name;
