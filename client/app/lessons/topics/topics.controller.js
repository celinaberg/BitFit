'use strict';

angular.module('its110App')
  .controller('TopicsCtrl', function ($scope, $stateParams, $location, $http, Auth, topics, topic, topicPromiseTC) { // topics is for manipulating questions
    $scope.topic = topic.data; 
	  $scope.topicsTC = topicPromiseTC.data;
	  $scope.tab = 1;
  	$scope.questionIndex = 0; // keeps track of which question the user is on
  	$scope.status = [];
    $scope.currentHint = 'Sorry, there are no more hints for this question';
  	$scope.editor = {};
    $scope.compileOutput = '';
    $scope.runOutput = '';
    $scope.showComments = false;
    $scope.feedback = '';
    $scope.className = '';
    //$scope.fileName = '';

    var endsWith = function(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }


    var getClassName = function() {
      if (endsWith($scope.className, '.java')) {
        $scope.className.slice(0, -5);
        return $scope.className.slice(0, -5);
      } else {
        return $scope.className;
      }
    }

    var getFileName = function() {
      if (endsWith($scope.className, '.java')) {
        return $scope.className;
      } else {
        return $scope.className + '.java';
      }
    }
    // FIXME: this functionality should be moved into topics service
    $scope.compileCode = function() {
      var className = getClassName();
      var fileName = getFileName();
      var obj = { 'className': className,
                  'fileName': fileName,
                  'code': $scope.editor.getValue(),
                  'user': Auth.getCurrentUser(),
                  'questionNum': $scope.questionIndex
          }
      $http.post('api/clis/compile', obj).success(function(data) {
        if (data === '') {
          // FIXME how to check if no file was actually compiled?
          $scope.compileOutput += 'Successfully compiled code.\n';
        } else {
          $scope.compileOutput += data;
        }
      });
    }

    // FIXME: this functionality should be moved into topics service
    $scope.runCode = function() {
      var className = getClassName();
      var obj = { 'className': className,
                  'user': Auth.getCurrentUser()
                }
      $http.post('api/clis/run', obj).success(function(data) {
        $scope.runOutput = data;
      });
    }

  	$scope.hintRequested = function() {
  		return $scope.status[$scope.questionIndex].hintRequested;
  	}
  	$scope.isSet = function(checkTab) {
          return $scope.tab === checkTab;
    };

    $scope.setTab = function(activeTab) {
          $scope.tab = activeTab;
    };

    $scope.checkAnswer = function() {
      var className = getClassName();
      var fileName = getFileName();
      var obj = { 'className': className,
                  'fileName': fileName,
                  'code': $scope.editor.getValue(),
                  'user': Auth.getCurrentUser(),
                  'questionNum': $scope.questionIndex
          }
      $http.post('api/clis/compile', obj).success(function(data) {
        if (data === '') {
          // FIXME how to check if no file was actually compiled?
          $scope.compileOutput += 'Successfully compiled code.\n';
        } else {
          $scope.compileOutput += data;
        }
        $http.post('api/clis/run', obj).success(function(data) {
          $scope.runOutput = data;
          // now we need to compare runOutput to expected output for this question
          if ($scope.topic.questions[$scope.questionIndex].expectedOutput.trim() === $scope.runOutput.trim()) {
            $scope.showComments = true;
            $scope.feedback = "Well done!";
          } else {
            $scope.showComments = true;
            console.log("here's expected output: ");
            console.log($scope.topic.questions[$scope.questionIndex].expectedOutput);
            console.log("here's your output");
            console.log($scope.runOutput);
            console.log($scope.runOutput.trim().length);
            console.log($scope.topic.questions[$scope.questionIndex].expectedOutput.trim().length);
            $scope.feedback = "Your output doesn't quite match the output we're looking for. Please try again";
          }
        });
      });

    }

    $scope.showHint = function() {
    	//$scope.currentHint = $scope.topic.questions[$scope.questionIndex].hints[$scope.status[$scope.questionIndex].hintIndex];
    	// increment hint index for this question
    	if ($scope.status[$scope.questionIndex].hintRequested === true) {
    		if ($scope.status[$scope.questionIndex].hintIndex < $scope.topic.questions[$scope.questionIndex].hints.length) {
    			$scope.status[$scope.questionIndex].hintIndex += 1;	
    		}
    	} else {
    		$scope.status[$scope.questionIndex].hintRequested = true;
    	}
    	
    	console.log('hint index for q: ', $scope.questionIndex);
    	console.log('hint index:', $scope.status[$scope.questionIndex].hintIndex);
    	// do i always display all hints?
    	//console.log($scope.topic.questions[$scope.questionIndex].hints[$scope.status[$scope.questionIndex].hintIndex]);

    };

   	$scope.nextQuestion = function() {
        if ($scope.questionIndex >= $scope.topic.questions.length -1) {
            $scope.questionIndex = 0;
        }
        else {
            $scope.questionIndex ++;
        }
        // update ace editor on page
        $scope.setStarterCode();
    };

    $scope.prevQuestion = function() {
        if ($scope.questionIndex == 0) {
            $scope.questionIndex = $scope.topic.questions.length -1;
        } else {
            $scope.questionIndex --;
        }
        $scope.setStarterCode();
    };

    $scope.isActive = function(id) {
    	// this function is dependent on the URL set in topics.js
      	return ('/lessons/topics/' + id) === $location.path();
    };

    $scope.aceLoaded = function(_editor) {
	    // Editor part
	    var _session = _editor.getSession();
	    var _renderer = _editor.renderer;

	    // Options
	    //_editor.setReadOnly(false);
	    //_session.setUndoManager(new ace.UndoManager());
	    _renderer.setShowGutter(true);
		  _editor.setTheme('ace/theme/crimson_editor');
      _editor.setShowPrintMargin(false);
    	_session.setMode('ace/mode/java');

    	$scope.editor = _editor;

    	$scope.setStarterCode();
    	_editor.focus();

	    // Events
	    _editor.on("changeSession", function(){ //... 
	    });
	    _session.on("change", function(){ 
	    //	alert(_session.getValue()); 
	    });
  	};

  	$scope.setStarterCode = function() {
  		// Set starter code, if there is any
    	if (typeof $scope.topic.questions !== 'undefinded' && 
    		typeof $scope.topic.questions[$scope.questionIndex] != 'undefined' &&
    		typeof $scope.topic.questions[$scope.questionIndex].code != 'undefined') {
	    	$scope.editor.setValue($scope.topic.questions[$scope.questionIndex].code, -1) // -1 is document start    		
    	}
  	};

  	// Reset button on code editor: resets the starter code (if any) given for this question
 	$scope.reset = function(week, q) {
  		$scope.editor.setValue($scope.topic.questions[$scope.questionIndex].code, -1);
  	};

  	// I'm Stuck button TODO: implement function
  	$scope.imStuck = function() {
  		// hints FIXME
  		console.log($scope.topic.questions[$scope.questionIndex].hints[0]);
  	};

  	$scope.init = function() {
		for (var i = 0; i < $scope.topic.questions.length; i++) {
  			$scope.status.push(
  			{
  				hintIndex: 0,
  				hintRequested: false
  			});
  		};
  	};
  	$scope.init();

  });
