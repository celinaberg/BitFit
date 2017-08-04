import angular from 'angular'

import template from './info.html'

export default angular.module('bitfit.lessons.info', [])
  .directive('info', () => ({
    template
  })).name
