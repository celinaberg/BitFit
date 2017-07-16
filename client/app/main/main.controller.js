export default class MainController {
  constructor ($scope) {
    $scope.login = this.login
  }

  login () {
    window.location.href = '/auth/cwl/login'
  }
}

MainController.$inject = ['$scope']
