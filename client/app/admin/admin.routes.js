import template from './admin.html';

routes.$inject = ['$stateProvider'];

export default function routes ($stateProvider) {
  $stateProvider
    .state('admin', {
      url: '/admin',
      template: template,
      controller: 'AdminCtrl',
      authenticate: true,
      resolve: {
    /* topic: ['$stateParams', 'topics', function($stateParams, topics) { // gets current topic before controller loads
        return topics.get($stateParams.id);
      }],*/
        topicPromiseAC: ['topics', function (topics) { // gets all the topics before controller loads
          return topics.getAll();
         }]
      }
    });
}
