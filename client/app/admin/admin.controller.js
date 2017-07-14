import Auth from '../../components/auth/auth.service';
import User from '../../components/auth/user.service';
import socket from '../../components/socket/socket.service';
import topics from '../../components/topics/topics.service';

export default class AdminController {
  constructor ($scope, $http, Auth, User, socket, topics, topicPromiseAC, $location) {
    // $scope.topic = topic;
    $scope.topics = topicPromiseAC.data;
    // $scope.allTopics = [];
    // the following should really be in the topics service file, and then pre loaded via admin.js resolve...
    /* $scope.topicsAC.forEach(function(ea) {
      $http.get('/api/topics/' + ea._id).success(function(res){ // this http call SHOULD be in topics service... but it wasn't working there
          $scope.allTopics.push(res);
        });
    });
*/
    $scope.editedTopic = {};

    $scope.newQuestion = {}; // this will go in admin functionality
    $scope.newTopic = {};
    // $scope.tab = 1;
    $scope.questionIndex = 0; // keeps track of which question the user is on

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    // $scope.questions = Question.query();
    // $scope.newQuestion = {};
    // $scope.questions = [];
    // $scope.topicTitle = '';
    // $scope.topicBackground = '';
    // $scope.topics = topics.getAll();
    // $log.log($scope.topics);
/*
    $http.get('/api/questions').success(function(questions) {
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
      if (!$scope.newTopic.topicTitle || $scope.newTopic.topicTitle === '') { return; }
      topics.create({
        title: $scope.newTopic.topicTitle,
        background: $scope.newTopic.topicBackground,
        questions: [ // not adding any questions....
            /* {
              instructions: "This is the instructions for the FIRST question",
              code: "for (int i = 0; i < 10; i++) { // do something }",
              hints: ['an', 'array', 'of', 'strings']
            },
            {
              instructions: "This is the instructions for the SECOND question",
              code: "for (int i = 0; i < 10; i++) { // do something }",
              hints: ['an', 'array', 'of', 'strings']
            },
            {
              instructions: "This is the instructions for the THIRD question",
              code: "for (int i = 0; i < 10; i++) { // do something }",
              hints: ['an', 'array', 'of', 'strings']
            } */
        ]
      }).success(function (topic) {
          // $scope.topicsAC.push(topic);
        $scope.topics.push(topic);
      });

      $scope.newTopic = {};
    };


    $scope.isActive = function (id) {
      // this function is dependent on the URL set in topics.js
      return ('/lessons/topics/' + id) === $location.path();
    };


    $scope.delete = function (user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function (u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  }
}

AdminController.$inject = ['$scope', '$http', Auth, User, socket, topics, 'topicPromiseAC', '$location'];
