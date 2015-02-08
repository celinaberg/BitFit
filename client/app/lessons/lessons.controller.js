'use strict';

angular.module('its110App')
  .controller('LessonsCtrl', function ($http, $scope, $location, $stateParams, $log, Auth, socket, topics, topicPromise) {
  	$scope.$log = $log;
  	$scope.editor = {};
  	//$scope.questions = [];
  	$scope.questionIndex = 0;
  	$scope.tab = 1;
  	//$scope.topicPromise = topicPromise;
  	//console.log('topic promise in lessons controller');
  	//console.log(topicPromise);
  	$scope.topics = topicPromise.data;
  	//console.log($scope.topicsLC);
  	//$scope.backgrounder = {};
  	// Get list of all topics and everything... shouldn't be here FIXME
  	//$scope.topics = topics.getAll(); 
  	// Get specific topic for this lesson
  	//$scope.topic = $scope.topics[$stateParams.id];
  	//$log.log('logging stuff here:');
  	//$log.log('scope.topics');
  	//$log.log($scope.topics);
  	//$log.log('doing log');
  	//$log.log(GetDBStuff);
  	//$scope.backgrounder = GetDBStuff.getBackground($location.path());
  	//$scope.$log($scope.backgrounder);

  /*	$scope.getBackground = function(url) {
  		$scope.backgroundInfo = GetDBStuff.getBackground(url);
  	};
*/
  	$scope.isSet = function(checkTab) {
          return $scope.tab === checkTab;
    };

    $scope.setTab = function(activeTab) {
          $scope.tab = activeTab;

          $log.log($location.path());
    };

    $scope.aceLoaded = function(_editor) {
	    // Editor part
	    var _session = _editor.getSession();
	    var _renderer = _editor.renderer;

	    // Options
	    //_editor.setReadOnly(false);
	    //_session.setUndoManager(new ace.UndoManager());
	    _renderer.setShowGutter(true);
		_editor.setTheme('ace/theme/idle_fingers');
    	_session.setMode('ace/mode/java');

    	//_editor.setValue($scope.questions[0][0].code, -1) // -1 is document start
    	$scope.editor = _editor;
    	_editor.focus();
 		$log.log('ace loaded');

	    // Events
	    // _editor.on("changeSession", function(){ //... 
	    // });
	    // _session.on("change", function(){ 
	    // //	alert(_session.getValue()); 
	    // });
  	};

    $http.get('/api/questions').success(function(allQs) {
  		//$scope.questions = allQs;
    	socket.syncUpdates('question', $scope.questions);
    });


    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('question');
    });

    $scope.nextQuestion = function() {
        if ($scope.questionIndex >= $scope.questions.length -1) {
            $scope.questionIndex = 0;
        }
        else {
            $scope.questionIndex ++;
        }
    };

    $scope.prevQuestion = function() {
        if ($scope.questionIndex === 0) {
            $scope.questionIndex = $scope.questions.length -1;
        } else {
            $scope.questionIndex --;
        }
    };

  	// fix this
  	// $scope.reset = function(week, q) {
  	// 	$scope.editor.setValue($scope.questions[0][0].code, -1);
  	// }

  	$scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.getPath = function() {
    	return $location.path();
    };

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }
  // ] // end controller array
   );

