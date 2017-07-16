import angular from 'angular'
import uiRouter from '@uirouter/angularjs'
import topics from './topics'
import questionInstructions from './questionInstructions'

import routing from './lessons.routes'
import LessonsController from './lessons.controller'

import './lessons.css'

export default angular.module('bitfit.lessons', [uiRouter, topics, questionInstructions])
  .config(routing)
  .controller('LessonsCtrl', LessonsController)
  .name
