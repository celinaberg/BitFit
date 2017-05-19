'use strict';

angular.module('bitfit')
  .config(function($stateProvider) {
    $stateProvider
      .state('logger', {
        url: '/admin/logger',
        templateUrl: 'app/admin/logger/logger.html',
        controller: 'loggerCtrl',
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
