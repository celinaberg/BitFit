export default class LessonsController {
  constructor($http, $scope, $location, $stateParams, Auth, socket, topics, topicPromise) {
    $scope.editor = {};
  	$scope.questionIndex = 0;
  	$scope.tab = 1;
  	$scope.topics = topicPromise.data;

    $http.get('/api/questions').success(function () {
  		// $scope.questions = allQs;
    	socket.syncUpdates('question', $scope.questions);
    });


    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('question');
    });

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isSet = isSet;
    $scope.setTab = setTab;
    $scope.aceLoaded = aceLoaded;
    $scope.nextQuestion = nextQuestion;
    $scope.prevQuestion = prevQuestion;
    $scope.getPath = getPath;
    $scope.logout = logout;
    $scope.isActive = isActive;
  }

  isSet(checkTab) {
    return $scope.tab === checkTab;
  };

  setTab(activeTab) {
    $scope.tab = activeTab;
  };

  aceLoaded(_editor) {
    // Editor part
    var _session = _editor.getSession();
    var _renderer = _editor.renderer;

    // Options
    // _editor.setReadOnly(false);
    // _session.setUndoManager(new ace.UndoManager());
    _renderer.setShowGutter(true);
    _editor.setTheme('ace/theme/idle_fingers');
    // _session.setMode('ace/mode/java');
    _session.setMode('ace/mode/c_cpp');

    // _editor.setValue($scope.questions[0][0].code, -1) // -1 is document start
    $scope.editor = _editor;
    _editor.focus();

    // Events
    // _editor.on("changeSession", function(){ //...
    // });
    // _session.on("change", function(){
    // //	alert(_session.getValue());
    // });
  };

  nextQuestion() {
    if ($scope.questionIndex >= $scope.questions.length - 1) {
      $scope.questionIndex = 0;
    } else {
      $scope.questionIndex ++;
    }
  };

  prevQuestion() {
    if ($scope.questionIndex === 0) {
      $scope.questionIndex = $scope.questions.length - 1;
    } else {
      $scope.questionIndex --;
    }
  };

  getPath() {
    return $location.path();
  };

  logout() {
    Auth.logout();
    $location.path('/login');
  };

  isActive(route) {
    // ???
    return '/lessons/topics/' + route === $location.path();
  };
}

LessonsController.$inject = ['$http', '$scope', '$location', '$stateParams', 'Auth', 'socket', 'topics', 'topicPromise'];
