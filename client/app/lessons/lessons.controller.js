class LessonsController {
  constructor ($http, $scope, $location, $stateParams, Auth, topicPromise) {
    $scope.editor = {}
    $scope.questionIndex = 0
    $scope.tab = 1
    $scope.topics = topicPromise

    $scope.isSet = (checkTab) => {
      return $scope.tab === checkTab
    }

    $scope.setTab = (activeTab) => {
      $scope.tab = activeTab
    }

    $scope.aceLoaded = (_editor) => {
      // Editor part
      const _session = _editor.getSession()
      const _renderer = _editor.renderer

      // Options
      // _editor.setReadOnly(false);
      // _session.setUndoManager(new ace.UndoManager());
      _renderer.setShowGutter(true)
      _editor.setTheme('ace/theme/tomorrow')
      // _session.setMode('ace/mode/java');
      _session.setMode('ace/mode/c_cpp')

      // _editor.setValue($scope.questions[0][0].code, -1) // -1 is document start
      $scope.editor = _editor
      _editor.focus()

      // Events
      // _editor.on("changeSession", function(){ //...
      // });
      // _session.on("change", function(){
      // //alert(_session.getValue());
      // });
    }

    $scope.nextQuestion = () => {
      if ($scope.questionIndex >= $scope.questions.length - 1) {
        $scope.questionIndex = 0
      } else {
        $scope.questionIndex ++
      }
    }

    $scope.prevQuestion = () => {
      if ($scope.questionIndex === 0) {
        $scope.questionIndex = $scope.questions.length - 1
      } else {
        $scope.questionIndex --
      }
    }

    $scope.getPath = () => {
      return this.location.path()
    }

    $scope.logout = () => {
      Auth.logout()
      $location.path('/')
    }

    $scope.isActive = (route) => {
      // ???
      return `/lessons/topics/${route}` === $location.path
    }
  }
}

LessonsController.$inject = ['$http', '$scope', '$location', '$stateParams', 'Auth', 'topicPromise']

module.exports = LessonsController
