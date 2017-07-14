import angular from 'angular';
import Flash from 'angular-flash';
import Auth from '../../../components/auth/auth.service';
import User from '../../../components/auth/auth.service';
import socket from '../../../components/socket/socket.service';
import topics from '../../../components/topics/topics.service';

export default class EditContentController {
  constructor($scope, $http, Auth, User, socket, topics, topic, topicPromiseEC, $location, Flash) {
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

    /**
      * Toggles the read only value of the starter code for this question.
      * @param {number} index the index of the code editor for this question.
      *                 Use -1 for adding a new question.
      * @return {} fixme
      */
    $scope.toggleReadOnly = function (index) {
    	let editor = {};
    	let q = {};
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
    };

    /**
     * Determines whether |str| ends with |suffix|.
     * @param {string} str the string to check.
     * @param {string} suffix the suffix to look for in |str|.
     * @return {} fixme
     */
    const endsWith = function (str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    // |useEditQuestion| - Boolean, whether to use the edit question variable
    const getClassName = function (useEditQuestion) {
    	let className = '';
    	if (useEditQuestion && typeof ($scope.questionToEdit.className) !== 'undefined') {
    		className = $scope.questionToEdit.className;
    	} else {
    		className = $scope.className;
    	}

		// if (endsWith(className, '.java')) {
      if (endsWith(className, '.c')) {
        className.slice(0, -5);
        return className.slice(0, -5);
      }
      return className;
    };

    const getFileName = function (useEditQuestion) {
    	let className = '';
  		if (useEditQuestion && typeof ($scope.questionToEdit.className) !== 'undefined') {
  			className = $scope.questionToEdit.className;
  		} else {
  			className = $scope.className;
  		}

  		// if (endsWith(className, '.java')) {
      if (endsWith(className, '.c')) {
  			return className;
  		}
  			// return className + '.java';
      return `${className}.c`;
    };

    // FIXME: this functionality should be moved into topics service
    // index is the index of the code editor for this question
    // use -1 for adding a new question
    $scope.compileCode = function (index) {
    	let editor = {};
    	let className = '';
    	let fileName = '';
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
      console.log('heres code:');
		  const code = editor.getValue();
      console.log(code);
  		// var editedCode = code.replace(/\\/g, '\\\\');
      // console.log(editedCode);
		  const obj = { className,
    fileName,
    code, // editedCode,
    user: Auth.getCurrentUser(),
    questionNum: $scope.questionIndex,
  };
      	$http.post('api/clis/compile', obj).success((data) => {
        if (data === '') {
          // FIXME how to check if no file was actually compiled?
          $scope.compileOutput += 'Successfully compiled code.\n';
        } else {
          $scope.compileOutput += data;
        }
      });
      // logging.progress.numCompiles++;
    };

    // FIXME: this functionality should be moved into topics service
    // index is the index of the code editor for this question
    // use -1 for adding a new question
    $scope.runCode = function (index) {
    	let fileName = '';
    	if (index < 0) { // adding new question
    		fileName = getFileName(false);
    	} else { // editing existing question
    		fileName = getFileName(true);
    	}

      const obj = { fileName,
        user: Auth.getCurrentUser(),
      };
   		$http.post('api/clis/run', obj).success((data) => {
        	$scope.runOutput = data;
      	});
      	// logging.progress.numRuns++;
    };

    $scope.editTopic = function () {
      // if (!$scope.editedTopic.title || $scope.editedTopic.title === '') { return; }
      // var editedTopic = $scope.allTopics[i];
      // editedTopic.title = $scope.editedTopic.title;
      topics.editTopic($scope.topic._id, $scope.topic).success((data) => {
        $scope.topic = data;
        $scope.topicsEC.forEach((ea) => {
        	if (ea._id === data._id) {
        		angular.copy(data, ea);
        	}
        });
        const message = 'Topic successfully updated!';
        Flash.create('success', message, 3500, { class: 'flash', id: 'flash-id' }, true);
      });
    };

    $scope.addHintToNewQ = function () {
    	$scope.newQuestion.hints.push('');
    };

    $scope.deleteHintFromNewQ = function (index) {
    	$scope.newQuestion.hints.splice(index, 1);
    };
    // FIXME hints aren't working...
    $scope.addHintToExistingQ = function () {
    	$scope.questionToEdit.hints.push('');
    	// $scope.topic.questions[questionIndex].hints.push("");
    };

    $scope.deleteHintFromExistingQ = function (hintIndex) {
    	// $scope.topic.questions[questionIndex].hints.splice(hintIndex, 1);
    	$scope.questionToEdit.hints.splice(hintIndex, 1);
    };

    $scope.focusEditor = function () {
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
    $scope.populateEditQForm = function (index) {
    	// Set up an editor for the question
    	const editor = ace.edit(`editor${index}`);
      // editor.getSession().setUseWorker(false);
		// Editor part
      const _session = editor.getSession();
      const _renderer = editor.renderer;

		// Options
		// _editor.setReadOnly(false);
		// _session.setUndoManager(new ace.UndoManager());
      _renderer.setShowGutter(true);
      editor.setTheme('ace/theme/crimson_editor');
		// _session.setMode('ace/mode/java');
      _session.setMode('ace/mode/c_cpp');
    	$scope.editors[index] = editor;

    	$scope.questionToEdit = $scope.topic.questions[index];
    	$scope.editors[index].setValue($scope.questionToEdit.code);
    	$scope.compileOutput = '';
    	$scope.runOutput = '';
    };

    $scope.isActive = function (id) {
      // this function is dependent on the URL set in topics.js
      return (`/admin/editContent/${id}`) === $location.path();
    };


    $scope.aceLoaded = function (_editor) {
      // Editor part
      // _editor.getSession().setUseWorker(false);
      const _session = _editor.getSession();
      const _renderer = _editor.renderer;


      // Options
      // _editor.setReadOnly(false);
      // _session.setUndoManager(new ace.UndoManager());
      _renderer.setShowGutter(true);
      _editor.setTheme('ace/theme/crimson_editor');
      // _session.setMode('ace/mode/java');
      _session.setMode('ace/mode/c_cpp');

      // _editor.setValue($scope.topic.questions[$scope.questionIndex].code, -1) // -1 is document start
      $scope.editor = _editor;
      // _editor.focus();

      console.log('aceloaded func');
      console.log($scope.editor);
      // Events
      // _editor.on('changeSession', function(){ //...
      // });
      // _session.on("change", function(){
      // //  alert(_session.getValue());
      // });
    };

    $scope.addQuestion = function () {
  		if ($scope.newQuestion.instructions === '') { return; }
  		topics.addQuestion($scope.topic._id, {
        	instructions: $scope.newQuestion.instructions,
        	code: $scope.newQuestion.code,
        	className: getClassName(false),
        	readOnly: $scope.newQuestion.readOnly,
        	expectedOutput: $scope.newQuestion.expectedOutput,
        	hints: $scope.newQuestion.hints,
    tags: $scope.newQuestion.tags,
  		}).success((question) => {
        	$scope.topic.questions.push(question);
    const message = 'Question successfully added!';
    Flash.create('success', message, 5000, { class: 'custom-class', id: 'custom-id' }, true);
      	});

  		$scope.newQuestion = {};
  		$scope.newQuestion.hints = [];
    };

    // does this automatically propogate to the topic being updated??
    $scope.editQ = function (questionIndex) {
      $scope.questionToEdit.code = $scope.editors[questionIndex].getValue();
      topics.editQuestion($scope.questionToEdit._id, $scope.questionToEdit).success(() => {
        	// update scope array of questions?
        $scope.questionToEdit = {};
        	$scope.questionToEdit.hints = [];
      	});
    };


    $scope.deleteQuestion = function (id, index) {
    	// console.log(index);
    	// console.log($scope.topic.questions);
    	topics.deleteQuestion($scope.topic.questions[index], $scope.topic._id);// .success(function(question) {
    		// why does this success function not get called?
    		// console.log('successfully deleted question: ' + question);
    	// });
    	console.log('deleted q in edit content controller now');
    	// $scope.topic.questions[index].splice(index, 1);
    	$scope.topic.questions.splice(index, 1);

    	// $http.delete('/api/questions/' + id);
    };

    $scope.$on('$destroy', () => {
  		socket.unsyncUpdates('question');
    });

    // / trying question reordering http://stackoverflow.com/a/27709541
    $scope.moveQUp = function (index) {
      if (index > -1 && index < $scope.topic.questions.length - 1) {
        const tmp = $scope.topic.questions[index + 1];
        $scope.topic.questions[index + 1] = $scope.topic.questions[index];
        $scope.topic.questions[index] = tmp;
      }
      // $scope.editTopic();
    };
    $scope.moveQDown = function (index) {
      if (index > 0 && index < $scope.topic.questions.length) {
        const tmp = $scope.topic.questions[index - 1];
        $scope.topic.questions[index - 1] = $scope.topic.questions[index];
        $scope.topic.questions[index] = tmp;
      }
      // $scope.editTopic();
    };
  }
}

EditContentController.$inject = ['$scope', '$http', Auth, User, socket, topics, 'topic', 'topicPromiseEC', '$location', Flash];
