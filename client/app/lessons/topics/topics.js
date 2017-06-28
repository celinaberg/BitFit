'use strict';

angular.module('its110App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('topics', {
        url: '/lessons/topics/{id}', // eventually fix this to be /lessons/week1/{id} etc
        templateUrl: 'app/lessons/topics/topics.html',
        controller: 'TopicsCtrl',
        authenticate: true,
        resolve: {
			topic: ['$stateParams', 'topics', function($stateParams, topics) { // gets current topic before controller loads
    			return topics.get($stateParams.id);
  			}],
  			topicPromiseTC: ['topics', function(topics) { // gets all the topics before controller loads
				return topics.getAll();
			}]
		}
      });
  });

  // this is going to serve up the individual topics