import angular from 'angular'

import NavBarController from './navbar.controller'
import Auth from '../auth/auth.service'

import html from './navbar.html'

export default angular.module('bitfit.component.navbar', [Auth])
  .controller('NavBarController', NavBarController)
  .directive('navbar', () => ({
    template: html,
    controller: 'NavBarController'
  }))
  .name
