import d3 from 'd3'

export default class LoggerController {
  constructor ($scope, $http) {
    $scope.selectedUsers = []
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
          brush (e) { $scope.updateList(e.active) }
        },
        dimensions: [
          'Total # Compiles',
          'Total Attempts',
          'Correct Attempts',
          'Hints Used'
        ]
      }
    }

    // $http.get('/api/loggers').then(function(data){
    //   $scope.data = data;
    // }).error(function(err){
    //   throw err;
    // });

    $http.get('/api/loggers').then((data) => {
      const nestedData = d3.nest()
      .key(d => d.user)
      .rollup(leaves => ({ 'Total # Compiles': d3.sum(leaves, d => parseFloat(d.numCompiles)),
        'Total Attempts': d3.sum(leaves, d => parseFloat(d.totalAttempts)),
        'Correct Attempts': d3.sum(leaves, d => parseFloat(d.correctAttempts)),
        'Hints Used': d3.sum(leaves, d => parseFloat(d.numHints))
      }))
      .entries(data)
      $scope.data = nestedData
    }).catch((err) => {
      throw err
    })

    $scope.updateList = function (val) {
      if (val.length === $scope.data.length) {
        $scope.$apply(() => {
          $scope.selectedUsers = []
        })
      } else {
        $scope.$apply(() => {
          $scope.selectedUsers = val
        })
      }
    }
  }
}

LoggerController.$inject = ['$scope', '$http']
