export default class AdminSidebarController {
  constructor ($scope, $location, Topics) {
    Topics.getAll().then((lessons) => {
      $scope.lessons = lessons
    })

    $scope.isActive = function (id) {
      return (`/lessons/topics/${id}`) === $location.path()
    }
  }
}

AdminSidebarController.$inject = ['$scope', '$location', 'Topics']
