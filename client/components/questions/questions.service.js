import angular from 'angular';

class Questions {
  constructor($http) {
    this.o = {
      questions: [],
    };
  }

  getAll() {
    return $http.get('/api/questions').success((data) => {
      angular.copy(data, o.questions);
    });
  }

  create(question) {
    return $http.post('/api/questions', question).success((data) => {
      o.questions.push(data);
    });
  }

  import(questions) {
    return $http.post('/api/questions/import', questions).success((data) => {
      angular.extend(o.questions, data);
    });
  }

  // get: function(id) {
  //   /* this worked fine - with $scope.question = question; after the js resolve
  //   return $http.get('/api/questions/' + id).then(function(res){
  //     return res.data;
  //   }); */
  //   return $http.get('/api/questions/' + id).success(function(res){
  //     return res;
  //   });
  // },

  // addQuestion: function(questionID, question) {
  //   return $http.post('/api/questions/' + questionID + '/questions', question);
  //   // FIXME: add question to o object here explicitly??
  // },

  editQuestion(id, question) {
    return $http.put(`/api/questions/${id}`, question).success((data) => {
      o.questions.forEach((ea) => {
        if (ea._id === data.question) {
          ea.questions.forEach((q) => {
            if (q._id === data._id) {
              q = data;
            }
          });
        }
      });
    });
  }

  // must delete question, and delete reference to it in question
  delete(question, questionID) {
    $http.delete(`/api/questions/${question._id}`);
    console.log('successfully deleted q');
  }

  // editquestion: function(id, question) {
  //   question.questions.forEach(function(ea, i) {
  //     question.questions[i] = ea._id;
  //   });

  //   return $http.put('/api/questions/' + id, question).success(function(data) {
  //     //var index = o.questions.indexOf(data._id);
  //     o.questions.forEach(function(ea) {
  //       if (ea._id === data._id) {
  //         angular.copy(data, ea);
  //       }
  //     });
  //   });
  // }
}

export default angular.module('bitfit.services.questions', ['$http'])
  .service('Questions', Questions)
  .name;
