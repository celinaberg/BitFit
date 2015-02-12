'use strict';

angular.module('its110App')
  .factory('logging', function ($http, Auth) {

    // Public API
    return {
      progress: { // update this throughout user's progress in a question
        'user': Auth.getCurrentUser()._id,
        'topic': '',
        'question': '',
        'startTime': '',
        'endTime': '',
        'numCompiles': 0,
        'numRuns': 0,
        'numHints': 0,
        'totalAttempts': 0,
        'correctAttempts': 0
      },
      logProgress: function () { // call this after user finishes a question
        $http.post('/api/loggers', this.progress).success(function() { // do we need |data| passed in?
          this.progress =  {
            'user': Auth.getCurrentUser()._id,
            'topic': '',
            'question': '',
            'startTime': '',
            'endTime': '',
            'numCompiles': 0,
            'numRuns': 0,
            'numHints': 0,
            'totalAttempts': 0,
            'correctAttempts': 0
          };
        });
      }
    }; // end return object
  });
