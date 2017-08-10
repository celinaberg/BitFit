export default class MainController {
  constructor($scope, $window) {
    $scope.login = () => {
      $window.location.href = "/auth/cwl/login";
    };
  }
}

MainController.$inject = ["$scope", "$window"];
