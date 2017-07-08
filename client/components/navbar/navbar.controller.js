'use strict';

angular.module('its110App')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
      {
        title: 'Home',
        link: '/'
      },
      {
        title: 'Lessons',
        link: '/lessons'
      }];

    $scope.navbarCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function () {
      Auth.logout();
      $location.path('/');
    };

    $scope.isActive = function (route) {
      return route === $location.path() ||
       ($location.path().includes('/admin') && route.includes('/admin')) ||
        ($location.path().includes('/lessons') && route.includes('/lessons'));
    };
  });
