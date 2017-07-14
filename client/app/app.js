'use strict';

import 'bootstrap/dist/css/bootstrap.css';
import './app.css';

import angular from 'angular';
import ngCookies from 'angular-cookies';
//import ngResource from 'angular-resource';
//import ngSanitize from 'angular-sanitize';
//import ngFlash from 'angular-flash';
//import btfordSocketIo from 'angular-socket-io';
//import textAngular from 'textangular';
import uiRouter from '@uirouter/angularjs';
//import uiAce from 'angular-ui-ace';
//import uiBootstrap from 'angular-ui-bootstrap';
//import nvd3 from 'nvd3';
//import googlechart from 'angular-google-chart';

import routing from './app.config';

import main from './main';
//import account from './account';
//import admin from './admin';
import lessons from './lessons';

// Components
//import Auth from '../components/auth/auth.service.js';

angular.module('bitfit', [
  ngCookies,
  //ngResource,
  //ngSanitize,
  //ngFlash,
  //btfordSocketIo,
  //textAngular,
  uiRouter,
  //uiAce,
  //uiBootstrap,
  //nvd3,
  //googlechart
  main,
  //account
  //admin
  lessons
]).config(routing)
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
  }).run(function () {
    console.log("Running BitFit");
  });
/*
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
*/
