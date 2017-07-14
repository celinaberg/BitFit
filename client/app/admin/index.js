import angular from 'angular';
import Logger from './logger';

import styles from './admin.css';

import routing from './admin.routes';
import AdminController from './admin.controller';

export default angular.module('bitfit.admin', [Logger])
  .config(routing)
  .controller('AdminCtrl', AdminController)
  .name;
