import angular from 'angular'
import ngCookies from 'angular-cookies'
import uiRouter from '@uirouter/angularjs'
import routing from './app.config'
import main from './main'
// import account from './account';
import Admin from './admin'
import lessons from './lessons'
import Auth from '../components/auth/auth.service.js'

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import './app.css'

angular.module('bitfit', [
  ngCookies,
  uiRouter,
  main,
  lessons,
  Admin,
  Auth
]).config(routing)
.factory('authInterceptor', ($rootScope, $q, $cookieStore, $location) => ({
      // Add authorization token to headers
  request (config) {
    config.headers = config.headers || {}
    if ($cookieStore.get('token')) {
      config.headers.Authorization = `Bearer ${$cookieStore.get('token')}`
    }
    return config
  },

      // Intercept 401s and redirect you to login
  responseError (response) {
    if (response.status === 401) {
      $location.path('/')
      return $q.reject(response)
    }

    return $q.reject(response)
  }
})).run(($rootScope, $location, Auth) => {
  console.log('Running BitFit')
    // Redirect to login if route requires auth and you're not logged in
  $rootScope.$on('$stateChangeStart', (event, next) => {
    Auth.isLoggedInAsync((err, loggedIn) => {
      if (err) {
        $location.path('/')
      }
      if (next.authenticate && !loggedIn) {
        $location.path('/.')
      }
    })
      // Check user's role if user is accessing Admin area
    Auth.isAdminAsync((err, isAdmin) => {
      if (err) {
        $location.path('/')
      }
      if ($location.path().includes('/admin') && !isAdmin) {
        $location.path('/')
      }
    })
  })
})
