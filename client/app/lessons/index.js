import angular from 'angular'
import uiRouter from '@uirouter/angularjs'
import topics from './topics'
import questionInstructions from './questionInstructions'
import background from './background'
import info from './info'

import routing from './lessons.routes'
import LessonsController from './lessons.controller'

import Auth from '../../components/auth/auth.service'
import Topics from '../../components/topics/topics.service'
import NavBar from '../../components/navbar'
import Sidebar from '../../components/sidebar'

import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'angular-ui-ace'

import './lessons.css'

export default angular.module('bitfit.lessons', [uiRouter, topics, questionInstructions, background, info, Auth, Topics, NavBar, 'ui.ace', Sidebar])
  .config(routing)
  .controller('LessonsCtrl', LessonsController)
  .name
