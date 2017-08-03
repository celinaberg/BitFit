import angular from 'angular'

export default class AdminSidebarController {
  constructor (topics) {
    $scope.topics = topics

    $scope.isActive = function (id) {
      return (`/lessons/topics/${id}`) === $location.path()
    }
  }
}

AdminSidebarController.$inject = ['topics']
