import angular from 'angular'

import './editContent.css'

import routing from './editContent.routes'
import EditContentController from './editContent.controller'

export default angular.module('bitfit.admin.edit-content', [])
  .config(routing)
  .controller('EditContentCtrl', EditContentController)
  .name
