import angular from 'angular'
import User from './user.service'

class Auth {
  constructor ($location, $rootScope, $http, User, $q, $window) {
    this.http = $http
    this.rootScope = $rootScope
    this.q = $q
    this.currentUser = {}
    $http.get('/api/users/me').then(data => {
      this.currentUser = data.data
      console.log(this.currentUser)
    }).catch(err => {
      if (err) {
        console.error('Could not login: ', err)
        this.currentUser = {}
        $location.path('/')
      }
    })

    /**
     * Redirect to login page
     */
    this.login = () => {
      $window.location.href = '/auth/cwl/login'
    }

    /**
     * Delete access token and user info
     *
     * @param  {Function}
     */
    this.logout = () => {
      this.currentUser = {}
    }

    /**
     * Gets all available info on authenticated user
     *
     * @return {Object} user
     */
    this.getCurrentUser = () => {
      return this.currentUser
    }

    /**
     * Check if a user is logged in
     *
     * @return {Boolean}
     */
    this.isLoggedIn = () => {
      return this.currentUser.hasOwnProperty('role')
    }

    /**
     * Waits for currentUser to resolve before checking if user is logged in
     */
    this.isLoggedInAsync = (cb) => {
      if (this.currentUser.hasOwnProperty('$promise')) {
        this.currentUser.$promise.then(() => {
          cb(null, true)
        }).catch(() => {
          cb(null, false)
        })
      } else if (this.currentUser.hasOwnProperty('role')) {
        cb(null, true)
      } else {
        cb(null, false)
      }
    }

    /**
     * Check if a user is an admin
     *
     * @return {Boolean}
     */
    this.isAdmin = () => {
      return this.currentUser.role === 'instructor'
    }

    this.isAdminAsync = (cb) => {
      if (this.currentUser.hasOwnProperty('$promise')) {
        this.currentUser.$promise.then(() => {
          if (this.currentUser.role === 'admin') {
            cb(null, true)
          } else {
            cb(null, false)
          }
        }).catch(() => {
          cb(null, false)
        })
      } else if (this.currentUser.role === 'admin') {
        cb(null, true)
      } else {
        cb(null, false)
      }
    }
  }
}

Auth.$inject = ['$location', '$rootScope', '$http', 'User', '$q', '$window']

export default angular.module('bitfit.services.auth', [User])
  .service('Auth', Auth)
  .name
