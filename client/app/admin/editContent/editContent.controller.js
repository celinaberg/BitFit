import angular from 'angular'
import ace from 'angular-ui-ace'

export default class EditContentController {
  constructor ($scope, $http, Auth, User, topics, topic, topicPromiseEC, $location, Flash) {
    $scope.topic = topic.data
    $scope.topicsEC = topicPromiseEC

    $scope.editor = {}
    $scope.editors = []

    $scope.newQuestion = {}
    $scope.newQuestion.hints = []

    $scope.questionToEdit = {}
    $scope.questionToEdit.hints = []

    $scope.compileOutput = ''
    $scope.runOutput = ''

    $scope.showComments = false
    $scope.feedback = ''
    $scope.className = ''
    $scope.readOnlyChecked = false

    /**
      * Toggles the read only value of the starter code for this question.
      * @param {number} index the index of the code editor for this question.
      *                 Use -1 for adding a new question.
      * @return {} fixme
      */
    $scope.toggleReadOnly = function (index) {
      let editor = {}
      let q = {}
      if (index < 0) {
        // use newQuestion
        q = $scope.newQuestion
        editor = $scope.editor
      } else {
        // use questionToEdit
        q = $scope.questionToEdit
        editor = $scope.editors[index]
      }
      if (editor.getReadOnly()) {
        editor.setReadOnly(false)
        q.readOnly = false
      } else {
        editor.setReadOnly(true)
        q.readOnly = true
      }
    }

    /**
     * Determines whether |str| ends with |suffix|.
     * @param {string} str the string to check.
     * @param {string} suffix the suffix to look for in |str|.
     * @return {} fixme
     */
    const endsWith = function (str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1
    }

    // |useEditQuestion| - Boolean, whether to use the edit question variable
    const getClassName = function (useEditQuestion) {
      let className = ''
      if (useEditQuestion && typeof ($scope.questionToEdit.className) !== 'undefined') {
        className = $scope.questionToEdit.className
      } else {
        className = $scope.className
      }

      if (endsWith(className, '.c')) {
        className.slice(0, -5)
        return className.slice(0, -5)
      }
      return className
    }

    const getFileName = function (useEditQuestion) {
      let className = ''
      if (useEditQuestion && typeof ($scope.questionToEdit.className) !== 'undefined') {
        className = $scope.questionToEdit.className
      } else {
        className = $scope.className
      }

      if (endsWith(className, '.c')) {
        return className
      }
      return `${className}.c`
    }

    // FIXME: this functionality should be moved into topics service
    // index is the index of the code editor for this question
    // use -1 for adding a new question
    $scope.compileCode = function (index) {
      let editor = {}
      let className = ''
      let fileName = ''
      if (index < 0) { // adding a new question
        editor = $scope.editor
        className = getClassName(false)
        fileName = getFileName(false)
      } else { // editing existing q
        editor = $scope.editors[index]
        className = getClassName(true)
        fileName = getFileName(true)
      }

      console.log('in compile func')
      console.log('heres code:')
      const code = editor.getValue()
      console.log(code)
      const obj = { className,
        fileName,
        code, // editedCode,
        user: Auth.getCurrentUser(),
        questionNum: $scope.questionIndex
      }
      $http.post('api/clis/compile', obj).then((data) => {
        if (data === '') {
          // FIXME how to check if no file was actually compiled?
          $scope.compileOutput += 'Successfully compiled code.\n'
        } else {
          $scope.compileOutput += data
        }
      })
    }

    // FIXME: this functionality should be moved into topics service
    // index is the index of the code editor for this question
    // use -1 for adding a new question
    $scope.runCode = function (index) {
      let fileName = ''
      if (index < 0) { // adding new question
        fileName = getFileName(false)
      } else { // editing existing question
        fileName = getFileName(true)
      }

      const obj = { fileName,
        user: Auth.getCurrentUser()
      }
      $http.post('api/clis/run', obj).then((data) => {
        $scope.runOutput = data
      })
    }

    $scope.editTopic = function () {
      topics.editTopic($scope.topic._id, $scope.topic).then((data) => {
        $scope.topic = data
        $scope.topicsEC.forEach((ea) => {
          if (ea._id === data._id) {
            angular.copy(data, ea)
          }
        })
        const message = 'Topic successfully updated!'
        Flash.create('success', message, 3500, { class: 'flash', id: 'flash-id' }, true)
      })
    }
	
	$scope.deleteTopic = function(){
		console.log("controller deleteTopic");
		topics.deleteTopic($scope.topic._id).success(function(data) {
			const message = "Successfully deleted topic: " + $scope.topic.title; 
			Flash.create('success', message, 3500, {class: 'flash', id: 'flash-id'}, true); 
		});	
	}

    $scope.addHintToNewQ = function () {
      $scope.newQuestion.hints.push('')
    }

    $scope.deleteHintFromNewQ = function (index) {
      $scope.newQuestion.hints.splice(index, 1)
    }
    // FIXME hints aren't working...
    $scope.addHintToExistingQ = function () {
      $scope.questionToEdit.hints.push('')
    }

    $scope.deleteHintFromExistingQ = function (hintIndex) {
      $scope.questionToEdit.hints.splice(hintIndex, 1)
    }

    $scope.focusEditor = function () {
      $scope.editor.focus()
    }

    $scope.populateEditQForm = function (index) {
      // Set up an editor for the question
      const editor = ace.edit(`editor${index}`)
      // Editor part
      const _session = editor.getSession()
      const _renderer = editor.renderer

    // Options
      _renderer.setShowGutter(true)
      editor.setTheme('ace/theme/tomorrow')
      _session.setMode('ace/mode/c_cpp')
      $scope.editors[index] = editor

      $scope.questionToEdit = $scope.topic.questions[index]
      $scope.editors[index].setValue($scope.questionToEdit.code)
      $scope.compileOutput = ''
      $scope.runOutput = ''
    }

    $scope.isActive = function (id) {
      // this function is dependent on the URL set in topics.js
      return (`/admin/editContent/${id}`) === $location.path()
    }

    $scope.aceLoaded = function (_editor) {
      // Editor part
      const _session = _editor.getSession()
      const _renderer = _editor.renderer

      // Options
      _renderer.setShowGutter(true)
      _editor.setTheme('ace/theme/tomorrow')
      _session.setMode('ace/mode/c_cpp')

      $scope.editor = _editor

      console.log('aceloaded func')
      console.log($scope.editor)
    }

    $scope.addQuestion = function () {
      if ($scope.newQuestion.instructions === '') { return }
      topics.addQuestion($scope.topic._id, {
        instructions: $scope.newQuestion.instructions,
        code: $scope.newQuestion.code,
        className: getClassName(false),
        readOnly: $scope.newQuestion.readOnly,
        expectedOutput: $scope.newQuestion.expectedOutput,
        hints: $scope.newQuestion.hints,
        tags: $scope.newQuestion.tags
      }).then((question) => {
        $scope.topic.questions.push(question)
        const message = 'Question successfully added!'
        Flash.create('success', message, 5000, { class: 'custom-class', id: 'custom-id' }, true)
      })

      $scope.newQuestion = {}
      $scope.newQuestion.hints = []
    }

    // does this automatically propogate to the topic being updated??
    $scope.editQ = function (questionIndex) {
      $scope.questionToEdit.code = $scope.editors[questionIndex].getValue()
      topics.editQuestion($scope.questionToEdit._id, $scope.questionToEdit).then(() => {
          // update scope array of questions?
        $scope.questionToEdit = {}
        $scope.questionToEdit.hints = []
      })
    }

    $scope.deleteQuestion = function (id, index) {
      topics.deleteQuestion($scope.topic.questions[index], $scope.topic._id)
      console.log('deleted q in edit content controller now')
      $scope.topic.questions.splice(index, 1)
    }

    // / trying question reordering http://stackoverflow.com/a/27709541
    $scope.moveQUp = function (index) {
      if (index > -1 && index < $scope.topic.questions.length - 1) {
        const tmp = $scope.topic.questions[index + 1]
        $scope.topic.questions[index + 1] = $scope.topic.questions[index]
        $scope.topic.questions[index] = tmp
      }
    }
    $scope.moveQDown = function (index) {
      if (index > 0 && index < $scope.topic.questions.length) {
        const tmp = $scope.topic.questions[index - 1]
        $scope.topic.questions[index - 1] = $scope.topic.questions[index]
        $scope.topic.questions[index] = tmp
      }
    }
  }
}

EditContentController.$inject = ['$scope', '$http', 'Auth', 'User', 'Topics', 'topic', 'topicPromiseEC', '$location', 'flash']
