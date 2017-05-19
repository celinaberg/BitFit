'use strict';

angular.module('bitfit')
  .config(function($stateProvider) {
    $stateProvider
      .state('lessons', {
        url: '/lessons',
        templateUrl: 'app/lessons/lessons.html',
        controller: 'LessonsCtrl',
        authenticate: true,
        // By using the _resolve_ property in this way, we are ensuring that anytime our
        // 'sidebar' state is entered, we will automatically query all topics from our backend before
        // the state actually finishes loading.
        resolve: { // resolve property is a list of things that need to happen BEFORE the controller (in this case, LessonsCtrl) instantiates
          topicPromise: ['topics', function(topics) {
            return topics.getAll();
          }]
        }
      });
    //.state('lessons.topics', {
    //     .state('lessons.topics', {
    //       url: '/topics/{id}', // eventually fix this to be /lessons/week1/{id} etc
    //       templateUrl: 'app/lessons/topics.html',
    //       controller: 'TopicsCtrl',
    //       resolve: {
    // 	topic: ['$stateParams', 'topics', function($stateParams, topics) {
    //   			return topics.get($stateParams.id);
    // 			}]
    // }
    //     });
  });
