'use strict';

angular.module('its110App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('logGraphs', {
        url: '/admin/graphs',
        templateUrl: 'app/admin/graphs.html',
        controller: 'GenericChartCtrl',
        authenticate: true
    });
  });
