import angular from "angular";

export default class UsersController {
  constructor($scope, User) {
    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, (u, i) => {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  }
}

UsersController.$inject = ["$scope", "User"];
