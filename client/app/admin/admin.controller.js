'use strict';
angular.module('bitfit').controller('AdminCtrl', function ($scope, $http, Auth, User, socket, topics, topicPromiseAC, $location) {
  //$scope.topic = topic;
  $scope.topics = topicPromiseAC.data;
  //$scope.allTopics = [];
  // the following should really be in the topics service file, and then pre loaded via admin.js resolve...
  /*$scope.topicsAC.forEach(function(ea) {
      $http.get('/api/topics/' + ea._id).then(function(res){ // this http call SHOULD be in topics service... but it wasn't working there
          $scope.allTopics.push(res);
        });
    });
*/
  $scope.editedTopic = {};
  $scope.newQuestion = {};
  // this will go in admin functionality
  $scope.newTopic = {};
  //$scope.tab = 1;
  $scope.questionIndex = 0;
  // keeps track of which question the user is on
  // Use the User $resource to fetch all users
  $scope.users = User.query();
  //$scope.questions = Question.query();
  //$scope.newQuestion = {};
  //$scope.questions = [];
  //$scope.topicTitle = '';
  //$scope.topicBackground = '';
  //$scope.topics = topics.getAll();
  //$log.log($scope.topics);
  /*
        $http.get('/api/questions').then(function(questions) {
          $scope.questions = questions;
          socket.syncUpdates('question', $scope.questions);
        });
    */
  /*
        $scope.isSet = function(checkTab) {
              return $scope.tab === checkTab;
        };

        $scope.setTab = function(activeTab) {
              $scope.tab = activeTab;
        };*/
  $scope.addTopic = function () {
    if (!$scope.newTopic.topicTitle || $scope.newTopic.topicTitle === '') {
      return;
    }
    topics.create({
      title: $scope.newTopic.topicTitle,
      background: $scope.newTopic.topicBackground,
      questions: []
    }).then(function (topic) {
      //$scope.topicsAC.push(topic);
      $scope.topics.push(topic);
    });
    $scope.newTopic = {};
  };
  $scope.isActive = function (id) {
    // this function is dependent on the URL set in topics.js
    return '/lessons/topics/' + id === $location.path();
  };
  $scope.delete = function (user) {
    User.remove({ id: user._id });
    angular.forEach($scope.users, function (u, i) {
      if (u === user) {
        $scope.users.splice(i, 1);
      }
    });
  };
});