import angular from 'angular'

angular.module('its110App')
  .config(($stateProvider) => {
    $stateProvider
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      })
  })
