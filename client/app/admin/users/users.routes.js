import template from './users.html'

routes.$inject = ['$stateProvider']

export default function routes ($stateProvider) {
  $stateProvider
    .state('users', {
      url: '/admin/users',
      template,
      controller: 'UsersCtrl',
      authenticate: true,
      resolve: {
        topicPromiseAC: ['Topics', function (topics) { // gets all the topics before controller loads
          return topics.getAll()
        }]
      }
    })
}
