'use strict';

angular.module('its110App')
  .controller('loggerCtrl', ['$scope', 'dataService', function($scope, dataService) {
    dataService.getData().then(function(response) {
      $scope.graphData = response.data;
      console.log("help: " + angular.isArray($scope.graphData));
    });
  }])
  .service('dataService', ['$http', function($http) {
    return {
      getData: function() {
        return $http.get('api/loggers');
      }
    };
  }]);