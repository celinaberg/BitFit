import Auth from '../../components/auth/auth.service'

export default class LessonsController {
  constructor ($http, $scope, $location, $stateParams, Auth, socket, topics, topicPromise) {
    this.scope = $scope
    this.scope.editor = {}
    this.scope.questionIndex = 0
    this.scope.tab = 1
    this.scope.topics = topicPromise.data

    this.location = $location

    $http.get('/api/questions').success(() => {
      // this.scope.questions = allQs;
      socket.syncUpdates('question', this.scope.questions)
    })

    this.scope.$on('$destroy', () => {
      socket.unsyncUpdates('question')
    })

    this.scope.isLoggedIn = Auth.isLoggedIn
    this.scope.isAdmin = Auth.isAdmin
    this.scope.getCurrentUser = Auth.getCurrentUser
    this.scope.isSet = this.isSet
    this.scope.setTab = this.setTab
    this.scope.aceLoaded = this.aceLoaded
    this.scope.nextQuestion = this.nextQuestion
    this.scope.prevQuestion = this.prevQuestion
    this.scope.getPath = this.getPath
    this.scope.logout = this.logout
    this.scope.isActive = this.isActive
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
    Auth.logout()
    this.location.path('/login')
  }

  isActive (route) {
    // ???
    return `/lessons/topics/${route}` === this.location.path()
  }
}

LessonsController.$inject = ['$http', '$scope', '$location', '$stateParams', Auth, 'socket', 'topics', 'topicPromise']
