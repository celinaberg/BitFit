'use strict';

angular.module('its110App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('editContent', {
        url: '/admin/editContent/{id}',
        templateUrl: 'app/admin/editContent/editContent.html',
        controller: 'EditContentCtrl',
        authenticate: true,
        resolve: {
          topic: ['$stateParams', 'topics', function ($stateParams, topics) { // gets current topic before controller loads
    			return topics.get($stateParams.id);
  			}],
  			topicPromiseEC: ['topics', function (topics) { // gets all the topics before controller loads
    return topics.getAll();
  }]
        }
      });
  });
