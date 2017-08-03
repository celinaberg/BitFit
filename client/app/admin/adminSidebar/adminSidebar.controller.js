export default class AdminSidebarController {
  constructor ($scope, $location, topics) {
    console.log('sidebar topics: ', topics)
    $scope.topics = topics

    $scope.isActive = function (id) {
      return (`/lessons/topics/${id}`) === $location.path()
    }
  }
}

AdminSidebarController.$inject = ['$scope', '$location', 'topics']
