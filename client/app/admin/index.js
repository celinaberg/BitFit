import angular from 'angular'
import Logger from './logger'
import EditContent from './editContent'
import AllQuestions from './allQuestions'
import Users from './users'
import Auth from '../../components/auth/auth.service'
import User from '../../components/auth/user.service'

import './admin.css'

import routing from './admin.routes'
import AdminController from './admin.controller'

import Topics from '../../components/topics/topics.service'
import NavBar from '../../components/navbar'
import adminSidebar from './adminSidebar'

export default angular.module('bitfit.admin', [Logger, EditContent, AllQuestions, Users, Topics, NavBar, Auth, User, adminSidebar])
  .config(routing)
  .controller('AdminCtrl', AdminController)
  .name
