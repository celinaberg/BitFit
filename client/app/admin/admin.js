'use strict';

angular.module('its110App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl',
        authenticate: true,        
        resolve: {
			/*topic: ['$stateParams', 'topics', function($stateParams, topics) { // gets current topic before controller loads
    			return topics.get($stateParams.id);
  			}],*/
  			  topicPromiseAC: ['topics', function(topics) { // gets all the topics before controller loads
				    return topics.getAll();
			     }]
		    }
      });
  });