import angular from 'angular'
import uiRouter from '@uirouter/angularjs'
import topics from './topics'
import questionInstructions from './questionInstructions'
import background from './background'

import routing from './lessons.routes'
import LessonsController from './lessons.controller'

import Auth from '../../components/auth/auth.service'
import Topics from '../../components/topics/topics.service'

import './lessons.css'

export default angular.module('bitfit.lessons', [uiRouter, topics, questionInstructions, background, Auth, Topics])
  .config(routing)
  .controller('LessonsCtrl', LessonsController)
  .name
