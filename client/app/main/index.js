import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import routing from './main.routes';
import MainController from './main.controller';

import './main.css';

export default angular.module('bitfit.main', [uiRouter])
  .config(routing)
  .controller('MainCtrl', MainController)
  .name;
