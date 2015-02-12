'use strict';

angular.module('its110App')
  .controller('AskQuestionCtrl', function ($scope, Auth, askAQuestion) { // topics is for manipulating questions
  	/*
  email: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userQuestion: String,
  date: { type: Date, default: Date.now },
  answered: Boolean,
  questionInstructions: String,
  topicString: String 
*/
	$scope.user = {
		userQuestion: '',
		topic: '',
		questionInstructions: '',
		name: '',
		email: ''
	};

  	$scope.feedback = '';

  	$scope.askAQuestion = function(title, instructions) {
  		$scope.user.topic = title;
  		$scope.user.questionInstructions = instructions;
    	var id = Auth.getCurrentUser()._id;
    	$scope.user.userId = id;

    	askAQuestion.postQuestion($scope.user).success(function(data) {
    		$scope.user = {};
    		$scope.feedback = 'Thank you. Your question has been submitted to the teaching team.'
    	});

    };
  });