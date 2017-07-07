'use strict';

angular.module('its110App')
  .factory('topics', function ($http) {
    var o = {
      topics: []
    };

    // Public API
    return {
      getAll: function () {
        return $http.get('/api/topics').success(function (data) {
          angular.copy(data, o.topics);
        });
      },

      create: function (topic) {
        return $http.post('/api/topics', topic).success(function (data) {
          o.topics.push(data);
        });
      },

      get: function (id) {
        /* this worked fine - with $scope.topic = topic; after the js resolve
        return $http.get('/api/topics/' + id).then(function(res){
          return res.data;
        }); */
        return $http.get('/api/topics/' + id).success(function (res) {
          return res;
        });
      },

      addQuestion: function (topicID, question) {
        return $http.post('/api/topics/' + topicID + '/questions', question);
        // FIXME: add question to o object here explicitly??
      },

      editQuestion: function (id, question) {
        return $http.put('/api/questions/' + id, question).success(function (data) {
          o.topics.forEach(function (ea) {
            if (ea._id === data.topic) {
              ea.questions.forEach(function (q) {
                if (q._id === data._id) {
                  q = data;
                }
              });
            }
          });
        });
      },

      // must delete question, and delete reference to it in topic
      deleteQuestion: function (question, topicID) {
        $http.post('/api/topics/' + topicID + '/delquestion', question).success(function (data) {
          // o.topics.forEach(function(ea) {
          console.log('successfully deleted q from topic');
          console.log(data);
          // })
        });
        // $http.delete('/api/questions/' + question._id); // is this correct? FIXME
      },

      editTopic: function (id, topic) {
        topic.questions.forEach(function (ea, i) {
          topic.questions[i] = ea._id;
        });

        return $http.put('/api/topics/' + id, topic).success(function (data) {
          // var index = o.topics.indexOf(data._id);
          o.topics.forEach(function (ea) {
            if (ea._id === data._id) {
              angular.copy(data, ea);
            }
          });
        });
      }
    }; // end return object
  });
