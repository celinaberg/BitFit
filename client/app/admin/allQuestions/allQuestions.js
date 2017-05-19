'use strict';

angular.module('bitfit')
  .config(function($stateProvider) {
    $stateProvider
      .state('allQuestions', {
        url: '/admin/allQuestions',
        templateUrl: 'app/admin/allQuestions/allQuestions.html',
        controller: 'AllQuestionsCtrl',
        authenticate: true,
        resolve: {
          topicPromiseEC: ['topics', function(topics) { // gets all the topics before controller loads
            return topics.getAll();
          }],
          questionPromiseEC: ['questions', function(questions) { // gets all the questions before controller loads
            return questions.getAll();
          }]
        }
      });
  });
