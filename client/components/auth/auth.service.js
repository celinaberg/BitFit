import angular from 'angular';
import User from './user.service';

class Auth {
  constructor($location, $rootScope, $http, User, $cookieStore, $q) {
    let currentUser = {};
    if ($cookieStore.get('token')) {
      currentUser = User.get();
    }
  }

  /**
   * Authenticate user and save token
   *
   * @param  {Object}   user     - login info
   * @param  {Function} callback - optional
   * @return {Promise}
   */
  login(user, callback) {
    const cb = callback || angular.noop;
    const deferred = $q.defer();

    $http.post('/auth/local', {
      email: user.email,
      password: user.password,
    })
    .success((data) => {
      $cookieStore.put('token', data.token);
      currentUser = User.get();
      deferred.resolve(data);
      return cb();
    })
    .error((err) => {
      this.logout();
      deferred.reject(err);
      return cb(err);
    });

    return deferred.promise;
  }

  /**
   * Delete access token and user info
   *
   * @param  {Function}
   */
  logout() {
    $cookieStore.remove('token');
    currentUser = {};
  }

  /**
   * Create a new user
   *
   * @param  {Object}   user     - user info
   * @param  {Function} callback - optional
   * @return {Promise}
   */
  createUser(user, callback) {
    const cb = callback || angular.noop;

    return User.save(user,
      (data) => {
        $cookieStore.put('token', data.token);
        currentUser = User.get();
        return cb(user);
      },
      (err) => {
        this.logout();
        return cb(err);
      }).$promise;
  }

  /**
   * Change password
   *
   * @param  {String}   oldPassword
   * @param  {String}   newPassword
   * @param  {Function} callback    - optional
   * @return {Promise}
   */
  changePassword(oldPassword, newPassword, callback) {
    const cb = callback || angular.noop;

    return User.changePassword({ id: currentUser._id }, {
      oldPassword,
      newPassword,
    }, user => cb(user), err => cb(err)).$promise;
  }

  /**
   * Gets all available info on authenticated user
   *
   * @return {Object} user
   */
  getCurrentUser() {
    return currentUser;
  }

  /**
   * Check if a user is logged in
   *
   * @return {Boolean}
   */
  isLoggedIn() {
    return currentUser.hasOwnProperty('role');
  }

  /**
   * Waits for currentUser to resolve before checking if user is logged in
   */
  isLoggedInAsync(cb) {
    if (currentUser.hasOwnProperty('$promise')) {
      currentUser.$promise.then(() => {
        cb(true);
      }).catch(() => {
        cb(false);
      });
    } else if (currentUser.hasOwnProperty('role')) {
      cb(true);
    } else {
      cb(false);
    }
  }

  /**
   * Check if a user is an admin
   *
   * @return {Boolean}
   */
  isAdmin() {
    return currentUser.role === 'admin';
  }

  isAdminAsync(cb) {
    if (currentUser.hasOwnProperty('$promise')) {
      currentUser.$promise.then(() => {
        if (currentUser.role === 'admin') {
          cb(true);
        } else {
          cb(false);
        }
      }).catch(() => {
        cb(false);
      });
    } else if (currentUser.role === 'admin') {
      cb(true);
    } else {
      cb(false);
    }
  }

  /**
   * Get auth token
   */
  getToken() {
    return $cookieStore.get('token');
  }
}

export default angular.module('bitfit.services.auth', [User])
  .service('Auth', Auth)
  .name;
