import angular from 'angular'
import User from './user.service'

class Auth {
  constructor ($location, $rootScope, $http, User, $cookieStore, $q) {
    this.http = $http
    this.rootScope = $rootScope
    this.cookieStore = $cookieStore
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
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    this.login = (user, callback) => {
      const cb = callback || angular.noop
      const deferred = this.q.defer()

      this.http.post('/auth/local', {
        email: user.email,
        password: user.password
      })
      .then((data) => {
        this.cookieStore.put('token', data.token)
        this.currentUser = User.get()
        deferred.resolve(data)
        return cb()
      })
      .catch((err) => {
        this.logout()
        deferred.reject(err)
        return cb(err)
      })

      return deferred.promise
    }

    /**
     * Delete access token and user info
     *
     * @param  {Function}
     */
    this.logout = () => {
      this.cookieStore.remove('token')
      this.currentUser = {}
    }

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    this.createUser = (user, callback) => {
      const cb = callback || angular.noop

      return User.save(user,
        (data) => {
          this.cookieStore.put('token', data.token)
          this.currentUser = User.get()
          return cb(user)
        },
        (err) => {
          this.logout()
          return cb(err)
        }).$promise
    }

    /**
     * Change password
     *
     * @param  {String}   oldPassword
     * @param  {String}   newPassword
     * @param  {Function} callback    - optional
     * @return {Promise}
     */
    this.changePassword = (oldPassword, newPassword, callback) => {
      const cb = callback || angular.noop

      return User.changePassword({ id: this.currentUser._id }, {
        oldPassword,
        newPassword
      }, user => cb(user), err => cb(err)).$promise
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

    /**
     * Get auth token
     */
    this.getToken = () => {
      return this.cookieStore.get('token')
    }
  }
}

Auth.$inject = ['$location', '$rootScope', '$http', 'User', '$cookieStore', '$q']

export default angular.module('bitfit.services.auth', [User])
  .service('Auth', Auth)
  .name
