import angular from 'angular'

import AdminSidebarController from './adminSidebar.controller'
import Topics from '../../../components/topics/topics.service'
import template from './adminSidebar.html'

export default angular.module('bitfit.admin.adminSidebar', [Topics])
  .controller('AdminSidebarController', AdminSidebarController)
  .directive('adminsidebar', () => ({
    template,
    resolve: {
      topics: ['Topics', function (topics) {
        return topics.getAll()
      }]
    }
  })).name
