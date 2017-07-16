import angular from 'angular'
import User from './user.service'

class Auth {
  constructor ($location, $rootScope, $http, User, $cookieStore, $q) {
    this.http = $http
    this.rootScope = $rootScope
    this.cookieStore = $cookieStore
    this.q = $q
    this.currentUser = {}
    if ($cookieStore.get('token')) {
      this.currentUser = User.get()
    }
  }

  /**
   * Authenticate user and save token
   *
   * @param  {Object}   user     - login info
   * @param  {Function} callback - optional
   * @return {Promise}
   */
  login (user, callback) {
    const cb = callback || angular.noop
    const deferred = this.q.defer()

    this.http.post('/auth/local', {
      email: user.email,
      password: user.password
    })
    .success((data) => {
      this.cookieStore.put('token', data.token)
      this.currentUser = User.get()
      deferred.resolve(data)
      return cb()
    })
    .error((err) => {
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
  logout () {
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
  createUser (user, callback) {
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
  changePassword (oldPassword, newPassword, callback) {
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
  getCurrentUser () {
    return this.currentUser
  }

  /**
   * Check if a user is logged in
   *
   * @return {Boolean}
   */
  isLoggedIn () {
    return this.currentUser.hasOwnProperty('role')
  }

  /**
   * Waits for currentUser to resolve before checking if user is logged in
   */
  isLoggedInAsync (cb) {
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
  isAdmin () {
    return this.currentUser.role === 'admin'
  }

  isAdminAsync (cb) {
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
  getToken () {
    return this.cookieStore.get('token')
  }
}

export default angular.module('bitfit.services.auth', [User])
  .service('Auth', Auth)
  .name
