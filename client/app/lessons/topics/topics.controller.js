'use strict';

angular.module('its110App')
  .controller('TopicsCtrl', function ($scope, $stateParams, $location, $http, Auth, topics, topic, topicPromiseTC, logging) { // topics is for manipulating questions
    $scope.topic = topic.data; 
	  $scope.topicsTC = topicPromiseTC.data;
	  $scope.tab = 1;
  	$scope.questionIndex = 0; // keeps track of which question the user is on
  	$scope.status = [];
    $scope.noMoreHints = 'Sorry, there are no more hints for this question';
  	$scope.editor = {};
    $scope.compileOutput = '';
    $scope.runOutput = '';
    $scope.showComments = false;
    $scope.feedback = '';
    $scope.className = '';

    //var Search = ace.Search;
    //var search = new Search().set({needle:'needle'});

    var endsWith = function(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };


    var getClassName = function() {
      if (endsWith($scope.className, '.java')) {
        $scope.className.slice(0, -5);
        return $scope.className.slice(0, -5);
      } else {
        return $scope.className;
      }
    };

    var getFileName = function() {
      if (endsWith($scope.className, '.java')) {
        return $scope.className;
      } else {
        return $scope.className + '.java';
      }
    };

    var escapeRegExp = function(string) {
      return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };

    var replaceAll = function(string, find, replace) {
      return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
      //return string.replace(new RegExp(find, 'g'), replace);
    };

    var replaceAll = function(string, find, replace) {
      //var newString = '';
      var n = string.search(find);
      console.log('heres n: ', n);
      if (n !== -1) {
        console.log('replacing');
        string = string.replace(find, replace);
        n = string.search(find);
        console.log('heres n in while: ', n);
        console.log('heres string:');
        console.log(string);
      }
      return string;
    }
    // FIXME: this functionality should be moved into topics service
    $scope.compileCode = function() {
      console.log('in compile func');
      var code = $scope.editor.getValue();
      var editedCode = code.replace(/\\/g, "\\\\");
      var className = getClassName();
      var fileName = getFileName();
      var obj = { 'className': className,
                  'fileName': fileName,
                  'code': editedCode,
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
      logging.progress.numCompiles++;
    };

    // FIXME: this functionality should be moved into topics service
    $scope.runCode = function() {
      var className = getClassName();
      var obj = { 'className': className,
                  'user': Auth.getCurrentUser()
                }
      $http.post('api/clis/run', obj).success(function(data) {
        $scope.runOutput = data;
      });
      logging.progress.numRuns++;
    };

  	$scope.hintRequested = function() {
  		return $scope.status[$scope.questionIndex].hintRequested;
  	};

  	$scope.isSet = function(checkTab) {
          return $scope.tab === checkTab;
    };

    $scope.setTab = function(activeTab) {
          $scope.tab = activeTab;
    };

    $scope.checkAnswer = function() {
      logging.progress.totalAttempts++;
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
          // now we compare runOutput to expected output for this question
          if ($scope.topic.questions[$scope.questionIndex].expectedOutput.trim() === $scope.runOutput.trim()) {
            $scope.showComments = true;
            $scope.feedback = "Well done!";
            logging.progress.correctAttempts++;
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
      logging.progress.numHints++;

    };

   	$scope.nextQuestion = function() {
        if ($scope.questionIndex >= $scope.topic.questions.length -1) {
            $scope.questionIndex = 0;
        }
        else {
            $scope.questionIndex ++;
        }
        // Update ace editor on page
        $scope.setStarterCode();

        // Log previous question's data
        logging.progress.endTime = Date.now();
        logging.logProgress();

        // Set up logging for new question
        logging.progress.topic = $scope.topic._id;
        logging.progress.question = $scope.topic.questions[$scope.questionIndex]._id;
        logging.progress.startTime = Date.now();
    };

    $scope.prevQuestion = function() {
        if ($scope.questionIndex == 0) {
            $scope.questionIndex = $scope.topic.questions.length -1;
        } else {
            $scope.questionIndex --;
        }
        // Update ace editor on page        
        $scope.setStarterCode();

        // Log previous question's data
        logging.progress.endTime = Date.now();
        logging.logProgress();

        // Set up logging for new question
        logging.progress.topic = $scope.topic._id;
        logging.progress.question = $scope.topic.questions[$scope.questionIndex]._id;
        logging.progress.startTime = Date.now();        
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
	    //_editor.on("changeSession", function(){ //... 
	    //});
	    //_session.on("change", function(){ 
	    //	alert(_session.getValue()); 
	    //});
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

  	$scope.init = function() {
		  for (var i = 0; i < $scope.topic.questions.length; i++) {
  			$scope.status.push(
  			{
  				hintIndex: 0,
  				hintRequested: false
  			});
  		};
      logging.progress.topic = $scope.topic._id;
      if ($scope.topic.questions.length > 0) {
        logging.progress.question = $scope.topic.questions[$scope.questionIndex]._id; // for first question only  
        logging.progress.startTime = Date.now();
      }
      
  	};
  	$scope.init();

  });
