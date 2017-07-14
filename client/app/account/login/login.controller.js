

angular.module('its110App')
  .controller('LoginCtrl', ($scope, Auth, $location) => {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password,
        })
        .then(() => {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch((err) => {
          $scope.errors.other = err.message;
        });
      }
    };
  });
