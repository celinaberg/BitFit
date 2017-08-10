import angular from "angular";

export default class AdminController {
  constructor($scope, $http, Auth, User, Topics, topicPromiseAC, $location) {
    $scope.topics = topicPromiseAC;
    $scope.editedTopic = {};
    $scope.newQuestion = {}; // this will go in admin functionality
    $scope.newTopic = {};
    $scope.questionIndex = 0; // keeps track of which question the user is on

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.addTopic = function() {
      if (!$scope.newTopic.topicTitle || $scope.newTopic.topicTitle === "") {
        return;
      }
      Topics.create({
        title: $scope.newTopic.topicTitle,
        background: $scope.newTopic.topicBackground,
        questions: []
      }).then(topic => {
        $scope.topics.push(topic);
      });

      $scope.newTopic = {};
    };

    $scope.isActive = function(id) {
      // this function is dependent on the URL set in topics.js
      return `/lessons/topics/${id}` === $location.path();
    };

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

AdminController.$inject = [
  "$scope",
  "$http",
  "Auth",
  "User",
  "Topics",
  "topicPromiseAC",
  "$location"
];
