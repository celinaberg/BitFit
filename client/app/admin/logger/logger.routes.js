import template from './logger.html'

routes.$inject = ['$stateProvider']

export default function routes ($stateProvider) {
  $stateProvider
    .state('logger', {
      url: '/admin/logger',
      template: template,
      controller: 'loggerCtrl',
      authenticate: true,
      resolve: {
        topicPromiseEC: ['Topics', function (topics) { // gets all the topics before controller loads
          return topics.getAll()
        }],
        questionPromiseEC: ['Questions', function (questions) { // gets all the questions before controller loads
          return questions.getAll()
        }]
      }
    })
}
