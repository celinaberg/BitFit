import angular from 'angular'
import Auth from '../auth/auth.service'
import _ from 'lodash'

function Logging ($http, Auth) {
  // Public API
  return {
    progress: { // update this throughout user's progress in a question
      user: Auth.getCurrentUser()._id,
      topic: '',
      question: '',
      startTime: '',
      endTime: '',
      numCompiles: 0,
      numErrorFreeCompiles: 0,
      numRuns: 0,
      numHints: 0,
      totalAttempts: 0,
      correctAttempts: 0
    },
    logProgress: function () { // call this after user finishes a question
      // temporary fix: clone a copy of progress so it can be reset immediately
      var tmp = _.cloneDeep(this.progress)
      $http.post('/api/loggers', tmp).success(function () { // do we need |data| passed in?
      })
      this.progress = {
        user: Auth.getCurrentUser()._id,
        topic: '',
        question: '',
        startTime: '',
        endTime: '',
        numCompiles: 0,
        numErrorFreeCompiles: 0,
        numRuns: 0,
        numHints: 0,
        totalAttempts: 0,
        correctAttempts: 0
      }
      console.log('reset prog obj')
    }
  }
}

Logging.$inject = ['$http', 'Auth']

export default angular.module('bitfit.services.logging', [Auth])
  .service('Logging', Logging)
  .name
