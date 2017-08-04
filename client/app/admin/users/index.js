import angular from 'angular'
import User from '../../../components/auth/user.service'

import routing from './users.routes'
import UsersController from './users.controller'

import Topics from '../../../components/topics/topics.service'
import NavBar from '../../../components/navbar'
import adminSidebar from '../adminSidebar'

export default angular.module('bitfit.admin.users', [Topics, NavBar, User, adminSidebar])
  .config(routing)
  .controller('UsersCtrl', UsersController)
  .name
