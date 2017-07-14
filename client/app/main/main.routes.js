import html from './main.html';

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('main', {
      url: '/',
      template: html,
      controller: 'MainCtrl',
    });
}
