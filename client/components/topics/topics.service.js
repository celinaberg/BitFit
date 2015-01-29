'use strict';

angular.module('its110App')
  .factory('topics', function ($http) {
    // Service logic
    // ...

    var o = {
      topics: []
    } /*{
      topics: [
        { title: 'Week 1 For loops!',
          link: '/lessons/week1',
          background: 'Hey, heres a little background info on some for loops, yo...',
          questions: []
        },
        {
          title: 'Week 2 If Statements!',
          link: '/lessons/week2',
          background: 'Hey, HERE is a little background info on some if statements, yo...',
          questions: []
        }
      ]
    };*/

    // Public API here
    return {
      getAll: function () {
        return $http.get('/api/topics').success(function(data) {
          //console.log('hey im in the topics service');
          //console.log('heres the data: ');
          //console.log(data);
          //return res.data;
          angular.copy(data, o.topics);
        });
      },

      create: function(topic) {
        return $http.post('/api/topics', topic).success(function(data) {
          o.topics.push(data);
        });
      },

      get: function(id) {
        /* this worked just fine - with $scope.topic = topic; after the js resolve
        return $http.get('/api/topics/' + id).then(function(res){
          console.log('in topics service');
          console.log(res.data);
          return res.data;
        }); */
        return $http.get('/api/topics/' + id).success(function(res){
          //console.log('in topics service');
          //console.log(res);
          return res;
        });
      },

      addQuestion: function(topicID, question) {
        //console.log(question);
        return $http.post('/api/topics/' + topicID + '/questions', question);
        // do i need to add question to my o object here explicitly??
      },

      editQuestion: function(id, question) {
        return $http.put('/api/questions/' + id, question).success(function(data) {
          o.topics.forEach(function(ea) {
            if (ea._id === data.topic) {
              ea.questions.forEach(function(q) {
                if (q._id === data._id) {
                  q = data;
                }
              });
            }
          });   
        });
      },
      // must delete question, and delete reference to it in topic
      deleteQuestion: function(question, topicID) {
        $http.post('/api/topics/' + topicID + '/delquestion', question).success(function(data) {
          //o.topics.forEach(function(ea) {
            console.log('successfully deleted q from topic');
            console.log(data);
          //})
        });
        $http.delete('/api/questions/' + question._id); // is this correct? FIXME
      },

      editTopic: function(id, topic) {
        console.log('in edit topic');
        //console.log(topic);
        topic.questions.forEach(function(ea, i) {
          topic.questions[i] = ea._id;
        });
        //console.log(topic);

        return $http.put('/api/topics/' + id, topic).success(function(data) {
          //var index = o.topics.indexOf(data._id);
          console.log(data);
          o.topics.forEach(function(ea) {
            if (ea._id === data._id) {
              console.log('we have an id match. heres ea');
              console.log(ea);
              angular.copy(data, ea);

              //ea = data;
              console.log('and now heres ea');
              console.log(ea);
            }
          });
        });
      }
    }; // end return object
  });
