import html from './topics.html';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('topics', {
      url: '/lessons/topics/{id}',
      template: html,
      controller: 'TopicsCtrl',
      authenticate: true,
      resolve: {
        topic: ['$stateParams', 'topics', function ($stateParams, topics) { // gets current topic before controller loads
          return topics.get($stateParams.id);
        }],
        topicPromiseTC: ['topics', function (topics) { // gets all the topics before controller loads
          return topics.getAll();
        }],
      },
    });
}
