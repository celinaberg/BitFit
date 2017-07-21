import html from './lessons.html'

routes.$inject = ['$stateProvider']

export default function routes ($stateProvider) {
  $stateProvider
    .state('lessons', {
      url: '/lessons',
      template: html,
      controller: 'LessonsCtrl',
      authenticate: true,
      resolve: {
        topicPromise: ['Topics', function (topics) {
          return topics.getAll()
        }]
      }
    })
}
