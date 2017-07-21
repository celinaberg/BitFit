import angular from 'angular'
import Logger from './logger'
import EditContent from './editContent'
import AllQuestions from './allQuestions'
import Auth from '../../components/auth/auth.service'
import User from '../../components/auth/user.service'

import './admin.css'

import routing from './admin.routes'
import AdminController from './admin.controller'

import Topics from '../../components/topics/topics.service'
import NavBar from '../../components/navbar'

export default angular.module('bitfit.admin', [Logger, EditContent, AllQuestions, Topics, NavBar, Auth, User])
  .config(routing)
  .controller('AdminCtrl', AdminController)
  .name
