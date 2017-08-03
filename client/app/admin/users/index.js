import angular from 'angular'
import Auth from '../../../components/auth/auth.service'
import User from '../../../components/auth/user.service'

import routing from './users.routes'
import UsersController from './users.controller'

import Topics from '../../../components/topics/topics.service'
import NavBar from '../../../components/navbar'

export default angular.module('bitfit.admin.users', [Topics, NavBar, Auth, User])
  .config(routing)
  .controller('UsersCtrl', UsersController)
  .name
