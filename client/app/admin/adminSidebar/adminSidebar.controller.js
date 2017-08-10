export default class AdminSidebarController {
  constructor($scope, $location, Topics) {
    Topics.getAll().then(lessons => {
      $scope.lessons = lessons;
    });

    $scope.isActive = function(url) {
      return "/admin" + url === $location.path();
    };

    $scope.isLessonActive = function(id) {
      return `/admin/editContent/${id}` === $location.path();
    };
  }
}

AdminSidebarController.$inject = ["$scope", "$location", "Topics"];
