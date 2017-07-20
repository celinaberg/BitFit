class NavBarController {
  constructor ($scope, $location, Auth, $window) {
    $scope.menu = [
      {
        title: 'Home',
        link: '/'
      },
      {
        title: 'Lessons',
        link: '/lessons'
      }]

    $scope.navbarCollapsed = true
    $scope.isLoggedIn = Auth.isLoggedIn
    $scope.isAdmin = Auth.isAdmin
    $scope.getCurrentUser = Auth.getCurrentUser

    $scope.logout = function () {
      Auth.logout()
      $window.location.href = '/auth/cwl/logout'
    }

    $scope.isActive = function (route) {
      return route === $location.path() ||
       ($location.path().includes('/admin') && route.includes('/admin')) ||
        ($location.path().includes('/lessons') && route.includes('/lessons'))
    }
  }
}

NavBarController.$inject = ['$scope', '$location', 'Auth', '$window']

module.exports = NavBarController
