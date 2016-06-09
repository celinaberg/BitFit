'use strict';

angular.module('its110App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('allQuestions', {
        url: '/admin/allQuestions',
        templateUrl: 'app/admin/allQuestions/allQuestions.html',
        controller: 'AllQuestionsCtrl',
        authenticate: true,        
        resolve: {
      // topic: ['$stateParams', 'topics', function($stateParams, topics) { // gets current topic before controller loads
      //     return topics.get($stateParams.id);
      //   }],
        topicPromiseEC: ['topics', function(topics) { // gets all the topics before controller loads
        return topics.getAll();
      }]
      ,
      questionPromiseEC: ['questions', function(questions) { // gets all the questions before controller loads
        return questions.getAll();
      }]
    }
      });
  });