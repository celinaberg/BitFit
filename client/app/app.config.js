routing.$inject = ["$urlRouterProvider", "$locationProvider", "$httpProvider"];

export default function routing(
  $urlRouterProvider,
  $locationProvider,
  $httpProvider
) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/");
  $httpProvider.interceptors.push("authInterceptor");
}
