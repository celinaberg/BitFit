
export default class TopicsController {
  constructor ($scope, $stateParams, $location, $http, Auth, topics, topic, topicPromiseTC, logging) {
    $scope.topic = topic.data
    $scope.topicsTC = topicPromiseTC
    $scope.tab = 1

    if ($location.search() !== {} && $scope.topic.questions.length >= $location.search().q) {
      $scope.qInfo = {
        currentQuestion: $location.search().q,
        totalQuestions: $scope.topic.questions.length * 10
      }
    } else {
      $scope.qInfo = {
        currentQuestion: 1,
        totalQuestions: $scope.topic.questions.length * 10
      }
    }

    $scope.status = []
    $scope.noMoreHints = 'Sorry, there are no more hints for this question'
    $scope.editor = {}

    $scope.output = {
      className: '',
      compileOutput: '',
      runOutput: '',
      expectedOutput: ''
    }

    $scope.showComments = false
    $scope.feedback = ''

    const endsWith = function (str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1
    }

    const getClassName = function () {
      if (endsWith($scope.output.className, '.c')) {
        $scope.output.className.slice(0, -5)
        return $scope.output.className.slice(0, -5)
      }
      return $scope.output.className
    }

    const getFileName = function () {
      if (endsWith($scope.output.className, '.c')) {
        return $scope.output.className
      }
      return `${$scope.output.className}.c`
    }

    // FIXME: this functionality should be moved into topics service
    $scope.compileCode = function () {
      $scope.showComments = false
      const code = $scope.editor.getValue()
      if (typeof (code) === 'undefined' || code === '') {
        $scope.output.compileOutput = 'In order to compile your program, please enter code in the code editor.\n'
        return
      }
      const className = getClassName()
      const fileName = getFileName()
      if (fileName === '.c') {
        $scope.output.compileOutput = 'In order to compile your program, please enter a name for your C file.\n'
        return
      }
      const obj = { className,
        fileName,
        code, // editedCode,
        user: Auth.getCurrentUser(),
        questionNum: $scope.qInfo.currentQuestion
      }
      $http.post('api/clis/compile', obj).then((res) => {
        if (res === '') {
          // FIXME how to check if no file was actually compiled?
          $scope.output.compileOutput = 'Successfully compiled code.\n'
          logging.progress.numErrorFreeCompiles++
        } else {
          $scope.output.compileOutput = res.data
        }
      })
      logging.progress.numCompiles++
    }

    // FIXME: this functionality should be moved into topics service
    $scope.runCode = function () {
      $scope.showComments = false
      $scope.output.runOutput = 'Attempting to run code...'
      const fileName = getFileName()
      const obj = { fileName,
        user: Auth.getCurrentUser()
      }
      $http.post('api/clis/run', obj).then((res) => {
        if (typeof (res) === 'object') { // Likely error
          $scope.output.runOutput += $scope.handleError(res)
        } else {
          $scope.output.runOutput = res.data
        }
      })
      logging.progress.numRuns++
    }

    $scope.handleError = function (data) {
      const str = JSON.stringify(data)
      if (str.search('"killed"') !== -1) {
        if (str.search('"killed":true') !== -1) {
          return '\nERROR: The system had to quit your program.\nCheck your code for infinite loops or other errors.'
        }  // program wasn't killed but some other error happened when attempting to run
        return '\nERROR: The system encountered an error when attempting to run your program. Check your code for errors.'
      }
    }

    $scope.hintRequested = function () {
      return $scope.status[$scope.qInfo.currentQuestion - 1].hintRequested
    }

    $scope.isSet = function (checkTab) {
      return $scope.tab === checkTab
    }

    $scope.setTab = function (activeTab) {
      $scope.tab = activeTab
    }

    // fixme: what happens when user pushes check answer a second time on the same question?
    /** Checks if student's answer matches the run output (for read only code), or
      * the expected code (if student is writing the code). Updates feedback variable accordingly.
      */
    $scope.checkAnswer = function () {
      $scope.showComments = true
      $scope.feedback = 'Checking answer...'
      logging.progress.totalAttempts++
      const className = getClassName()
      const fileName = getFileName()
      const code = $scope.editor.getValue()

      const obj = { className,
        fileName,
        code, // editedCode,
        user: Auth.getCurrentUser(),
        questionNum: $scope.qInfo.currentQuestion
      }
      if (typeof (code) === 'undefined' || code === '') {
        $scope.showComments = false
        $scope.output.compileOutput = 'In order to check your answer, please enter code in the code editor.\n'
        return
      }
      $http.post('api/clis/compile', obj).then((data) => {
        if (data === '') {
          $scope.output.compileOutput = 'Successfully compiled code.\n'
        } else {
          $scope.output.compileOutput = data
        }

        $http.post('api/clis/run', obj).then((data) => {
          if (typeof (data) === 'object') { // Likely an error
            $scope.showComments = false
            $scope.output.runOutput += $scope.handleError(data)
          } else {
            $scope.output.runOutput = data
            // now we compare runOutput to expected output for this question
            if ($scope.output.expectedOutput.trim() === $scope.output.runOutput.trim()) {
              $scope.feedback = 'Well done!'
              logging.progress.correctAttempts++
            } else {
              $scope.feedback = 'Your output doesn\'t quite match the output we\'re looking for. Please try again\n'
            }
          }
        })
      })
    }

    $scope.showHint = function () {
      // Increment hint index for this question
      if ($scope.status[$scope.qInfo.currentQuestion - 1].hintRequested === true) {
        if ($scope.status[$scope.qInfo.currentQuestion - 1].hintIndex < $scope.topic.questions[$scope.qInfo.currentQuestion - 1].hints.length) {
          $scope.status[$scope.qInfo.currentQuestion - 1].hintIndex += 1
        }
      } else {
        $scope.status[$scope.qInfo.currentQuestion - 1].hintRequested = true
      }
      logging.progress.numHints++
    }

    $scope.setPage = function (pageNo) {
      $scope.qInfo.currentQuestion = pageNo
    }

    $scope.topicNav = function () {
      logging.progress.endTime = Date.now()
      logging.logProgress()
    }

    $scope.pageChanged = function () {
      // Update ace editor on page
      $scope.updatePageWithNewQuestion()

      // Log previous question's data
      logging.progress.endTime = Date.now()
      logging.logProgress() // async so this returns immediately

      // Set up logging for new question
      logging.progress.topic = $scope.topic._id
      logging.progress.question = $scope.topic.questions[$scope.qInfo.currentQuestion - 1]._id
      logging.progress.startTime = Date.now()

      $location.search('q', $scope.qInfo.currentQuestion)
    }

    $scope.isActive = function (id) {
      // this function is dependent on the URL set in topics.js
      return (`/lessons/topics/${id}`) === $location.path()
    }

    $scope.aceLoaded = function (_editor) {
      // Editor part
      const _session = _editor.getSession()
      const _renderer = _editor.renderer

      // Options
      _renderer.setShowGutter(true)
      _editor.setTheme('ace/theme/tomorrow')
      _editor.setFontSize('11')
      _editor.setShowPrintMargin(false)
      _session.setMode('ace/mode/c_cpp')

      $scope.editor = _editor

      $scope.updatePageWithNewQuestion()
      _editor.focus()
    }

    $scope.updatePageWithNewQuestion = function () {
      $scope.showComments = false
      $scope.output.runOutput = ''
      $scope.output.compileOutput = ''
      // Return if there are no questions
      if (typeof ($scope.topic.questions) === 'undefined' ||
        typeof ($scope.topic.questions[$scope.qInfo.currentQuestion - 1]) === 'undefined') {
        return
      }
      const currQuestion = $scope.topic.questions[$scope.qInfo.currentQuestion - 1]

      // Set starter code, if this question has any
      if (typeof (currQuestion.code) !== 'undefined') {
        $scope.editor.setValue($scope.topic.questions[$scope.qInfo.currentQuestion - 1].code, -1) // -1 is document start
      }

      // Set class name variable, if provided
      if (typeof (currQuestion.className) !== 'undefined') {
        $scope.output.className = currQuestion.className
      } else {
        $scope.output.className = ''
      }

      // Set expected output, if provided
      if (typeof (currQuestion.expectedOutput) !== 'undefined') {
        $scope.output.expectedOutput = currQuestion.expectedOutput
      } else {
        $scope.output.expectedOutput = ''
      }

      // Set editor to read only if question requires it
      if (currQuestion.readOnly) {
        $scope.editor.setReadOnly(true)
      } else {
        $scope.editor.setReadOnly(false)
      }
    }

    $scope.init = function () {
      for (let i = 0; i < $scope.topic.questions.length; i++) {
        $scope.status.push(
          {
            hintIndex: 0,
            hintRequested: false
          })
      }

      logging.progress.topic = $scope.topic._id

      if ($scope.topic.questions.length > 0) {
        logging.progress.question = $scope.topic.questions[$scope.qInfo.currentQuestion - 1]._id // for first question only
        logging.progress.startTime = Date.now()
      }
    }

    $scope.init()
  }
}

TopicsController.$inject = ['$scope', '$stateParams', '$location', '$http', 'Auth', 'Topics', 'topic', 'topicPromiseTC', 'Logging']
