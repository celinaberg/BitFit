export default class AdminSidebarController {
  constructor ($scope, $location, Topics) {
    Topics.getAll().then((lessons) => {
      $scope.lessons = lessons
    })

    $scope.isLessonActive = function (id) {
      return (`/lesson/${id}` === $location.path())
    }
  }
}

AdminSidebarController.$inject = ['$scope', '$location', 'Topics']
