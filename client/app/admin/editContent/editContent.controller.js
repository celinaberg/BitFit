'use strict';

angular.module('its110App')
  .controller('EditContentCtrl', function ($scope, $http, Auth, User, socket, topics, topic, topicPromiseEC, $location, $log) {
    $scope.topic = topic.data; 
    $scope.topicsEC = topicPromiseEC.data;
    
    $scope.editor = {};
    $scope.editors = [];
    
    $scope.newQuestion = {};
    $scope.newQuestion.hints = [];

    $scope.questionToEdit = {};
    $scope.questionToEdit.hints = [];

    $scope.compileOutput = '';
    $scope.runOutput = '';
    
    $scope.showComments = false;
    $scope.feedback = '';
    $scope.className = '';
    $scope.readOnlyChecked = false;

    // index is the index of the code editor for this question
    // use -1 for adding a new question
    $scope.toggleReadOnly = function(index) {
    	var editor = {};
    	var q = {}
    	if (index < 0) {
    		// use newQuestion
    		q = $scope.newQuestion;
    		editor = $scope.editor;
    	} else {
    		// use questionToEdit
    		q = $scope.questionToEdit;
    		editor = $scope.editors[index];
    	}
    	if (editor.getReadOnly()) {
    		editor.setReadOnly(false);
    		q.readOnly = false;
    	} else {
    		editor.setReadOnly(true);
    		q.readOnly = true;
    	}
    	console.log('heres updated q: ');
    	console.log(q);
    };

    //var editor2 = ace.edit("editor");
    //console.log('made editor2');
    // editor.session.doc.$lines // gets each line of editor as an array, separating lines at \n
    // to get multpile ace editors on page
/*
	require.config({paths: { "ace" : "../lib/ace"}});
	require(["ace/ace", "ace/ext/themelist"], function(ace) {

	var $ = document.getElementById.bind(document);
	var dom = require("ace/lib/dom");



	// create first editor
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
	editor.session.setMode("ace/mode/javascript");
	editor.renderer.setScrollMargin(10, 10);
	editor.setOptions({
	    // "scrollPastEnd": 0.8,
	    autoScrollEditorIntoView: true
	});

	var count = 1;
	function add() {
	    var oldEl = editor.container
	    var pad = document.createElement("div")
	    pad.style.padding = "40px"
	    oldEl.parentNode.insertBefore(pad, oldEl.nextSibling)

	    var el = document.createElement("div")
	    oldEl.parentNode.insertBefore(el, pad.nextSibling)

	    count++
	    var theme = themes[Math.floor(themes.length * Math.random() - 1e-5)]
	    editor = ace.edit(el)
	    editor.setOptions({
	        mode: "ace/mode/javascript",
	        theme: theme,
	        autoScrollEditorIntoView: true
	    })

	    editor.setValue([
	        "this is editor number: ", count, "\n",
	        "using theme \"", theme, "\"\n",
	        ":)"
	    ].join(""), -1)

	}

*/


    var endsWith = function(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    // |useEditQuestion| - Boolean, optional, whether to use the edit question variable
    var getClassName = function(useEditQuestion) {
    	var className = '';
    	if (useEditQuestion && typeof($scope.questionToEdit.className) !== 'undefined') {
    		className = $scope.questionToEdit.className;
    	} else {
    		className = $scope.className;
    	}

		if (endsWith(className, '.java')) {
			className.slice(0, -5);
			return className.slice(0, -5);
		} else {
			return className;
		}
    };

    var getFileName = function(useEditQuestion) {
    	var className = '';
  		if (useEditQuestion && typeof($scope.questionToEdit.className) !== 'undefined') {
  			className = $scope.questionToEdit.className;
  		} else {
  			className = $scope.className;
  		}

  		if (endsWith(className, '.java')) {
  			return className;
  		} else {
  			return className + '.java';
  		}
    };

    // FIXME: this functionality should be moved into topics service
    // index is the index of the code editor for this question
    // use -1 for adding a new question
    $scope.compileCode = function(index) {
    	var editor = {};
    	var className = '';
    	var fileName = '';
    	if (index < 0) { // adding a new question
    		editor = $scope.editor;
    		className = getClassName(false);
    		fileName = getFileName(false);
    	} else { // editing existing q
    		editor = $scope.editors[index];
    		className = getClassName(true);
    		fileName = getFileName(true);
    	}

  		console.log('in compile func');
		var code = editor.getValue();
  		var editedCode = code.replace(/\\/g, "\\\\");
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
      //logging.progress.numCompiles++;
    };

    // FIXME: this functionality should be moved into topics service
    // index is the index of the code editor for this question
    // use -1 for adding a new question
    $scope.runCode = function(index) {
    	var className = '';
    	if (index < 0) { // adding new question
    		className = getClassName(false);
    	} else { // editing existing question
    		className = getClassName(true);
    	}

        var obj = { 'className': className,
                    'user': Auth.getCurrentUser()
                  }
   		$http.post('api/clis/run', obj).success(function(data) {
        	$scope.runOutput = data;
      	});
      	//logging.progress.numRuns++;
    };




    $scope.editTopic = function() {
      //if (!$scope.editedTopic.title || $scope.editedTopic.title === '') { return; }
      //var editedTopic = $scope.allTopics[i];
      //editedTopic.title = $scope.editedTopic.title;
      topics.editTopic($scope.topic._id, $scope.topic).success(function(data) {
        $scope.topic = data;
        $scope.topicsEC.forEach(function(ea) {
        	if (ea._id === data._id) {
        		angular.copy(data, ea);
        	}
        })        
      });
    };

    $scope.addHintToNewQ = function() {
    	$scope.newQuestion.hints.push("");
    };

    $scope.deleteHintFromNewQ = function(index) {
    	$scope.newQuestion.hints.splice(index, 1);
    }
    // FIXME hints aren't working...
    $scope.addHintToExistingQ = function(questionIndex) {
    	$scope.questionToEdit.hints.push("");
    	//$scope.topic.questions[questionIndex].hints.push("");
    };

    $scope.deleteHintFromExistingQ = function(hintIndex) {
    	//$scope.topic.questions[questionIndex].hints.splice(hintIndex, 1);
    	$scope.questionToEdit.hints.splice(hintIndex, 1);
    };

    $scope.focusEditor = function() {
    	$scope.editor.focus();
    };

    // $scope.compileCode = function() { // this is in add question, so use $scope.editor
    // 	console.log($scope.editor.getValue());
    // 	var obj = {'code': $scope.editor.getValue(),
    // 				'user': Auth.getCurrentUser(),
    // 				'questionNum': $scope.topic.questions.length // since this is a new q to be added
    // 			}
    // 	$http.post('api/clis/compile', obj).success(function(data) {
    // 		console.log('in compile code success func');
    // 		console.log(data);

    // 		if (data === '') {
    // 			$scope.CLOutput += 'Successfully compiled code.\n';
    // 		} else {
    // 			data.trim();
    // 			$scope.CLOutput += data;
    // 			console.log($scope.CLOutput);	
    // 		}
    		
    // 	})
    // }

    // $scope.runCode = function() { // this is in add question, so use $scope.editor
    // 	var obj = {'className': 'Test',
    // 			   'user': Auth.getCurrentUser()
    // 			}

    // 	$http.post('api/clis/run', obj).success(function(data) {
    // 		console.log('in run code success function');
    // 		console.log(data);
    // 		$scope.CLOutput += data;
    // 	})
    // }
    $scope.populateEditQForm = function(index) {
    	// Set up an editor for the question
    	var editor = ace.edit("editor" + index);
		// Editor part
		var _session = editor.getSession();
		var _renderer = editor.renderer;

		// Options
		//_editor.setReadOnly(false);
		//_session.setUndoManager(new ace.UndoManager());
		_renderer.setShowGutter(true);
		editor.setTheme('ace/theme/crimson_editor');
		_session.setMode('ace/mode/java');
    	$scope.editors[index] = editor;

    	$scope.questionToEdit = $scope.topic.questions[index];
    	$scope.editors[index].setValue($scope.questionToEdit.code);
    	$scope.compileOutput = '';
    	$scope.runOutput = '';
    };

    $scope.isActive = function(id) {
      // this function is dependent on the URL set in topics.js
        return ('/admin/editContent/' + id) === $location.path();
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
      _session.setMode('ace/mode/java');

      //_editor.setValue($scope.topic.questions[$scope.questionIndex].code, -1) // -1 is document start
      $scope.editor = _editor;
      _editor.focus();

      // Events
      _editor.on("changeSession", function(){ //... 
      });
      _session.on("change", function(){ 
      //  alert(_session.getValue()); 
      });
    };

    $scope.addQuestion = function() {
  		if($scope.newQuestion.instructions === '') { return; }
      
  		topics.addQuestion($scope.topic._id, {
        	instructions: $scope.newQuestion.instructions,
        	code: $scope.newQuestion.code,
        	className: getClassName(false),
        	readOnly: $scope.readOnlyChecked,
        	expectedOutput: $scope.newQuestion.expectedOutput,
        	hints: $scope.newQuestion.hints
  		}).success(function(question) {
        	$scope.topic.questions.push(question);
      	});
      
  		$scope.newQuestion = {};
  		$scope.newQuestion.hints = [];
    };

    // does this automatically propogate to the topic being updated??
    $scope.editQ = function(questionID, questionIndex) {
    	console.log('heres what im sending to be updated:');
    	console.log($scope.topic.questions[questionIndex]);
    	console.log('and heres q to edit');
    	console.log($scope.questionToEdit);

    	//$scope.topic.questions[questionIndex].code = $scope.editors[questionIndex].getValue();
		$scope.questionToEdit.code = $scope.editors[questionIndex].getValue();
		// topics.editQuestion(questionID, $scope.topic.questions[questionIndex]).success(function(question) {
  //       	console.log('successfully updated question');
  //       	$scope.questionToEdit = {};
  //     	});
		topics.editQuestion($scope.questionToEdit._id, $scope.questionToEdit).success(function(question) {
        	console.log('successfully updated question');
        	$scope.questionToEdit = {};
        	$scope.questionToEdit.hints = [];
      	});
    };



    $scope.deleteQuestion = function(id, index) {
    	//console.log(index);
    	//console.log($scope.topic.questions);
    	topics.deleteQuestion($scope.topic.questions[index], $scope.topic._id).success(function(question) {
    		// why does this success function not get called?
    	});
    	console.log('deleted q in edit content controller now');
    	//$scope.topic.questions[index].splice(index, 1); 
    	$scope.topic.questions.splice(index, 1);

    	//$http.delete('/api/questions/' + id);
    };

    $scope.$on('$destroy', function () {
  		socket.unsyncUpdates('question');
    });



  });
