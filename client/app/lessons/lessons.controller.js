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
	    _editor.on("changeSession", function(){ //... 
	    });
	    _session.on("change", function(){ 
	    //	alert(_session.getValue()); 
	    });
  	};

    $http.get('/api/questions').success(function(allQs) {
  		//$scope.questions = allQs;
  		//$log.log('in http.get func');
  		//$log.log($scope.editor);
    	//$scope.editor.setValue($scope.questions[$scope.questionIndex].code, -1);
    	//$scope.editor.focus();
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
        if ($scope.questionIndex == 0) {
            $scope.questionIndex = $scope.questions.length -1;
        } else {
            $scope.questionIndex --;
        }
    };

  	/* Questions data model:
  	   [week1, week2,...] --> 
  		weekN = [{q1}, {q2}, {q3},... {qN}] --> 
  		qN = {  'instructions' : "<string with instructions>", 
  				'code' : "<string with java starter code>",
  				'hints' : ['hints', 'go', 'in this array'] 
  			 } 
  		questions[weekN][qN].instructions?
    */ 
  	$scope.questionsStatic = [
  			[// w1q1
  				{ 	'instructions' : "Add code to the code editor to make the system output numbers 1 through 10.",
					'code' : "for (int i = 0; i < 10; i ++) {\n\n}",
				 	'hints' : [ "first hint", "second hint", "third hint! Do you get it now?" ]
 		 		},
  			 // w1q2
  			 	{   'instructions' : "Add code to the code at right to create a valid for loop",
					'code' : "for (int i = 0; ; i ++) {\n\tSystem.out.println(\"Hello world!\");\n}",
					'hints' : [ "first hint correct for loop", "second hint", "third hint! Do you get it now?" ]
	     		},
	     	// w1q3
	     		{	'instructions': "w1q3 not written yet", 
	     			'code' : 'no code yet',
	     			'hints' : ['no', 'hints', 'yet']
	     		}
	  		],
  			[// w2q1
  				{ 	'instructions' : "Add code to the code at right to make the system output cold or hot",
					'code' : "if (x == 10)\n{ System.out.println(\"it's cold!\";\nelse {\nSystem.out.println(\"It's hot!\");",
				 	'hints' : [ "ifs first hint", "second hint", "third hint! Do you get it now?" ]
 		 		},
  			 // w2q2
  			 	{   'instructions' : "Add code to the code at right to create a valid if statement",
					'code' : "if (x == )\n{ System.out.println(\"it's cold!\";\nelse {\nSystem.out.println(\"It's hot!\");",
					'hints' : [ "first hint correct for loop", "second hint", "third hint! Do you get it now?" ]
	     		},
	     	// w2q3
	     		{	'instructions': "w2q3 not written yet", 
	     			'code' : 'no code yet',
	     			'hints' : ['no', 'hints', 'yet']
	     		}
	  		],
  			[// w3q1
  				{	'instructions': "w3q1 not written yet", 
	     			'code' : 'no code yet',
	     			'hints' : ['no', 'hints', 'yet']
	     		}
  			]
  	];

  	// fix this
  	$scope.reset = function(week, q) {
  		$scope.editor.setValue($scope.questions[0][0].code, -1);
  	}

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

