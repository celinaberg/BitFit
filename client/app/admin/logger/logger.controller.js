'use strict';

angular.module('its110App')
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
                  brush: function(e){ $scope.updateList(e.active); }
                },
                dimensions: [
                    "numCompiles",
                    "totalAttempts",
                    "correctAttempts",
                    "numHints"
                ]
            }
        };

        
        // $http.get('/api/loggers').success(function(data){
        //   $scope.data = data;
        // }).error(function(err){
        //   throw err;
        // });

        $http.get('/api/loggers').success(function(data){
          var nested_data = d3.nest()
          .key(function(d) { return d.user; })
          .rollup(function(leaves) { return {"numCompiles": d3.sum(leaves, function(d) {return parseFloat(d.numCompiles);}),
           "totalAttempts": d3.sum(leaves, function(d) {return parseFloat(d.totalAttempts);}),
           "correctAttempts": d3.sum(leaves, function(d) {return parseFloat(d.correctAttempts);}),
           "numHints": d3.sum(leaves, function(d) {return parseFloat(d.numHints);})
         } })
          .entries(data);
          $scope.data = nested_data;
          console.log($scope.data[10]);
        }).error(function(err){
          throw err;
        });

    $scope.updateList = function(val) {
    //setTimeout(function () {
        $scope.$apply(function () {
            $scope.selectedUsers = val;
        });
    //}, 200);
  };

  });