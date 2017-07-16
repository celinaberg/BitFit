import template from './allQuestions.html'

routes.$inject = ['$stateProvider']

export default function routes ($stateProvider) {
  $stateProvider
    .state('allQuestions', {
      url: '/admin/allQuestions',
      template: template,
      controller: 'AllQuestionsCtrl',
      authenticate: true,
      resolve: {
        topicPromiseEC: ['topics', function (topics) { // gets all the topics before controller loads
          return topics.getAll()
        }],
        questionPromiseEC: ['questions', function (questions) { // gets all the questions before controller loads
          return questions.getAll()
        }]
      }
    })
}
