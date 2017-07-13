'use strict';

import angular from 'angular';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import ngFlash from 'angular-flash';
/*import main from './main';
import account from './account';
import admin from './admin';*/

angular.module('its110App', [
  ngCookies,
  ngResource,
  ngSanitize,
  ngFlash,
  'btford.socket-io',
  'textAngular',
  'ui.router',
  'ui.ace',
  'ui.bootstrap',
  'nvd3',
  'googlechart'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }

        return $q.reject(response);
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
      // Check user's role if user is accessing Admin area
      // if ($location.path().includes('/admin') && !Auth.isAdmin()) {
      //     console.log('redirecting as not admin!!!');
      //     $location.path('/');
      //   }
      Auth.isAdminAsync(function (isAdmin) {
        if ($location.path().includes('/admin') && !isAdmin) {
          $location.path('/');
        }
      });
    });
  });
