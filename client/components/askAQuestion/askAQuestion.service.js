'use strict';

angular.module('its110App')
  .factory('askAQuestion', function ($http) {
    // Service logic
    var o = {
      forumQuestions: []
    };
/*
  email: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userQuestion: String,
  date: { type: Date, default: Date.now },
  answered: Boolean,
  questionInstructions: String,
  topicString: String 
*/

    // Public API
    return {
      getAll: function () {
        return $http.get('/api/helpForums').then(function(data) {
          angular.copy(data, o.forumQuestions);
        });
      },

      postQuestion: function(forumQ) {
        return $http.post('/api/helpForums', forumQ).then(function(data) {
          o.forumQuestions.push(data);
        });
      },

      editForumQuestion: function(id, forumQ) {
        return $http.put('/api/helpForums/' + id, forumQ).then(function(data) {
          //o.forumQuestions.forEach(function(ea) {
            // if (ea._id === data._id) {
            //   angular.copy(data, ea);
            // }
          //});
          angular.copy(data, o.forumQuestions);
        });
      }
    };
  });
