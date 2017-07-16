import template from './editContent.html'

routes.$inject = ['$stateProvider']

export default function routes ($stateProvider) {
  $stateProvider
    .state('editContent', {
      url: '/admin/editContent/{id}',
      template: template,
      controller: 'EditContentCtrl',
      authenticate: true,
      resolve: {
        topic: ['$stateParams', 'topics', function ($stateParams, topics) { // gets current topic before controller loads
          return topics.get($stateParams.id)
        }],
        topicPromiseEC: ['topics', function (topics) { // gets all the topics before controller loads
          return topics.getAll()
        }]
      }
    })
}
