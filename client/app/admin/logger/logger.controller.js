'use strict';

angular.module('bitfit')
  .controller('loggerCtrl', function($scope, $http) {
    $scope.selectedUsers = [];
    $scope.options = {
      chart: {
        type: 'parallelCoordinates',
        height: 450,
        // width: 600,
        margin: {
          top: 30,
          right: 10,
          bottom: 10,
          left: 10
        },
        dispatch: {
          brush: function(e) {
            $scope.updateList(e.active);
          }
        },
        dimensions: [
          "Total # Compiles",
          "Total Attempts",
          "Correct Attempts",
          "Hints Used"
        ]
      }
    };

    // $http.get('/api/loggers').then(function(data){
    //   $scope.data = data;
    // }).error(function(err){
    //   throw err;
    // });

    $http.get('/api/loggers').then(function(data) {
      var nested_data = d3.nest()
        .key(function(d) {
          return d.user;
        })
        .rollup(function(leaves) {
          return {
            "Total # Compiles": d3.sum(leaves, function(d) {
              return parseFloat(d.numCompiles);
            }),
            "Total Attempts": d3.sum(leaves, function(d) {
              return parseFloat(d.totalAttempts);
            }),
            "Correct Attempts": d3.sum(leaves, function(d) {
              return parseFloat(d.correctAttempts);
            }),
            "Hints Used": d3.sum(leaves, function(d) {
              return parseFloat(d.numHints);
            })
          }
        })
        .entries(data);
      $scope.data = nested_data;
    }).catch(function(err) {
      throw err;
    });

    $scope.updateList = function(val) {
      if (val.length == $scope.data.length) {
        $scope.$apply(function() {
          $scope.selectedUsers = [];
        });
      } else {
        $scope.$apply(function() {
          $scope.selectedUsers = val;
        });
      }
    };

  });
