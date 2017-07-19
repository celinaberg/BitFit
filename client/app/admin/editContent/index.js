import angular from 'angular'

import './editContent.css'

import routing from './editContent.routes'
import EditContentController from './editContent.controller'
import NavBar from '../../components/navbar'

export default angular.module('bitfit.admin.edit-content', [NavBar])
  .config(routing)
  .controller('EditContentCtrl', EditContentController)
  .name
