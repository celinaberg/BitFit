import angular from 'angular'

import './editContent.css'

import routing from './editContent.routes'
import EditContentController from './editContent.controller'
import NavBar from '../../../components/navbar'
import Topics from '../../../components/topics/topics.service'
import 'angular-flash'
import textAngular from 'textangular'
import adminSidebar from '../adminSidebar'

export default angular.module('bitfit.admin.edit-content', [NavBar, Topics, 'flash', textAngular, adminSidebar])
  .config(routing)
  .controller('EditContentCtrl', EditContentController)
  .name
