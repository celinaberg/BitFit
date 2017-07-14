'use strict';

/*angular.module('its110App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });*/

import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import routing from './main.routes';
//import * as MainController from './main.controller';

import './main.css';

export default angular.module('bitfit.main', [uiRouter])
  .config(routing)
  .controller('MainCtrl', function ($scope) {
      $scope.login = function () {
        window.location.href = '/auth/cwl/login';
      };
    })
  .name;
