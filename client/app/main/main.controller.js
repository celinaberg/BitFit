'use strict';

angular.module('its110App')
  .controller('MainCtrl', function ($scope, $http, $location){
    $scope.login = function () {
      window.location.href = '/auth/cwl/login';
    };
  });
