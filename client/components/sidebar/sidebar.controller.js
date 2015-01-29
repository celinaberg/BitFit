'use strict';

angular.module('its110App')
  .controller('SidebarCtrl', function ($scope, $location, Auth, topics, $log) {
    $scope.menu = [
      {
        'title': 'Week 1',
        'link': '/lessons/week1'
      },
      {
        'title': 'Week 2',
        'link': '/lessons/week2'
      },
      {
        'title': 'Week 3',
        'link': '/lessons/week3'
      },
      {
        'title': 'Week 4',
        'link': '/lessons/week4'
      },
      {
        'title': 'Week 5',
        'link': '/lessons/week5'
      }
      ];  
    //console.log('in sidebar controller');
    //console.log(topicPromise);
    //$scope.topics = topicPromise;

    //$log.log('about to log topics promise from sidebar controller')
    //$log.log($topicPromise);

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });