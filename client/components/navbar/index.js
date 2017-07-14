import angular from 'angular';

import NavBarController from './navbar.controller';

import html from './navbar.html';

export default angular.module('bitfit.component.navbar', [])
  .controller('NavBarController', NavBarController)
  .directive('navbar', function() {
    return {
      template: html
    };
  })
  .name;
