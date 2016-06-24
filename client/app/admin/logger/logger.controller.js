'use strict';

angular.module('its110App')
  .controller('loggerCtrl', function($scope) {
    $scope.graphDrawn = false;
    var myChart = {};
    var newSeries = {};
    var x = {};
    var y = {};

    $scope.drawGraph = function() {
      if(!$scope.graphDrawn) {
        var svg = dimple.newSvg("#chartContainer", 900, 700);
        d3.json("/api/loggers", function (data) {
          myChart = new dimple.chart(svg, data);
          myChart.setBounds(60, 30, 840, 500)
          x = myChart.addCategoryAxis("x", "user");
          y = myChart.addMeasureAxis("y", "totalAttempts");
         //myChart.addMeasureAxis("z", "numCompiles");
          newSeries = myChart.addSeries("question", dimple.plot.line);
          newSeries.aggregate = dimple.aggregateMethod.sum;
          myChart.addLegend(180, 10, 730, 20, "right");
          myChart.draw();
        });
        $scope.graphDrawn = true;
      }
    };

    $scope.updateGraph = function(axis, measure) {
      if($scope.graphDrawn) {
        switch(axis) {
          case 'x':
          x.categoryFields[0] = measure;
          break;
          case 'y':
          y.measure = measure;
          break;
        }
        myChart.draw(2000);
        // var graphType;
        // switch(type) {
        //   case "area":
        //     graphType = dimple.plot.area;
        //     break;
        //   case "line":
        //     graphType = dimple.plot.line;
        //     break;
        //   case "bubble":
        //     graphType = dimple.plot.bubble;
        //     break;
        //   default:
        //     graphType = dimple.plot.bubble;
        // }
        // // FIXME: doesn't work - "illegal string" error
        // var index;
        // for(var i = 0; i < myChart.series.length; i++) {
        //   if(myChart.series[i] === newSeries){
        //         index = i;
        //         break;
        //   }
        // }    
        // myChart.series[index].shapes.remove();
        // myChart.series.splice(index, 1);
        // //
        // newSeries = myChart.addSeries("user", graphType);
        // myChart.draw(2000);
        // console.log(myChart.series);
      }
    };


  });