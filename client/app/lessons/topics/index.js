import angular from 'angular'
import uiRouter from '@uirouter/angularjs'

import routing from './topics.routes'
import TopicsController from './topics.controller'

import './topics.css'

export default angular.module('bitfit.topics', [uiRouter])
  .config(routing)
  .controller('TopicsCtrl', TopicsController)
  .name
