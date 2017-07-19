class LessonsController {
  constructor ($http, $scope, $location, $stateParams, Auth, topicPromise) {
    this.scope = $scope
    this.scope.editor = {}
    this.scope.questionIndex = 0
    this.scope.tab = 1
    this.scope.topics = topicPromise

    this.location = $location
    this.auth = Auth

    this.scope.isLoggedIn = Auth.isLoggedIn.bind(this)
    this.scope.isAdmin = Auth.isAdmin.bind(this)
    this.scope.getCurrentUser = Auth.getCurrentUser
    this.scope.isSet = this.isSet
    this.scope.setTab = this.setTab
    this.scope.aceLoaded = this.aceLoaded
    this.scope.nextQuestion = this.nextQuestion
    this.scope.prevQuestion = this.prevQuestion
    this.scope.getPath = this.getPath
    this.scope.logout = this.logout
    this.scope.isActive = this.isActive.bind(this)
  }

  isSet (checkTab) {
    return this.scope.tab === checkTab
  }

  setTab (activeTab) {
    this.scope.tab = activeTab
  }

  aceLoaded (_editor) {
    // Editor part
    const _session = _editor.getSession()
    const _renderer = _editor.renderer

    // Options
    // _editor.setReadOnly(false);
    // _session.setUndoManager(new ace.UndoManager());
    _renderer.setShowGutter(true)
    _editor.setTheme('ace/theme/idle_fingers')
    // _session.setMode('ace/mode/java');
    _session.setMode('ace/mode/c_cpp')

    // _editor.setValue(this.scope.questions[0][0].code, -1) // -1 is document start
    this.scope.editor = _editor
    _editor.focus()

    // Events
    // _editor.on("changeSession", function(){ //...
    // });
    // _session.on("change", function(){
    // //alert(_session.getValue());
    // });
  }

  nextQuestion () {
    if (this.scope.questionIndex >= this.scope.questions.length - 1) {
      this.scope.questionIndex = 0
    } else {
      this.scope.questionIndex ++
    }
  }

  prevQuestion () {
    if (this.scope.questionIndex === 0) {
      this.scope.questionIndex = this.scope.questions.length - 1
    } else {
      this.scope.questionIndex --
    }
  }

  getPath () {
    return this.location.path()
  }

  logout () {
    this.auth.logout()
    this.location.path('/')
  }

  isActive (route) {
    // ???
    return `/lessons/topics/${route}` === this.location.path()
  }
}

LessonsController.$inject = ['$http', '$scope', '$location', '$stateParams', 'Auth', 'topicPromise']

module.exports = LessonsController
