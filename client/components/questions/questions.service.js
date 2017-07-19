import angular from 'angular'

class Questions {
  constructor ($http) {
    this.http = $http
    this.o = {
      questions: []
    }
  }

  getAll () {
    return this.http.get('/api/questions').then((data) => {
      angular.copy(data, this.o.questions)
    })
  }

  create (question) {
    return this.http.post('/api/questions', question).then((data) => {
      this.o.questions.push(data)
    })
  }

  import (questions) {
    return this.http.post('/api/questions/import', questions).then((data) => {
      angular.extend(this.o.questions, data)
    })
  }

  // get: function(id) {
  //   /* this worked fine - with $scope.question = question; after the js resolve
  //   return this.http.get('/api/questions/' + id).then(function(res){
  //     return res.data;
  //   }); */
  //   return this.http.get('/api/questions/' + id).then(function(res){
  //     return res;
  //   });
  // },

  // addQuestion: function(questionID, question) {
  //   return this.http.post('/api/questions/' + questionID + '/questions', question);
  //   // FIXME: add question to o object here explicitly??
  // },

  editQuestion (id, question) {
    return this.http.put(`/api/questions/${id}`, question).then((data) => {
      this.o.questions.forEach((ea) => {
        if (ea._id === data.question) {
          ea.questions.forEach((q) => {
            if (q._id === data._id) {
              q = data
            }
          })
        }
      })
    })
  }

  // must delete question, and delete reference to it in question
  delete (question, questionID) {
    this.http.delete(`/api/questions/${question._id}`)
    console.log('successfully deleted q')
  }

  // editquestion: function(id, question) {
  //   question.questions.forEach(function(ea, i) {
  //     question.questions[i] = ea._id;
  //   });

  //   return this.http.put('/api/questions/' + id, question).then(function(data) {
  //     //var index = o.questions.indexOf(data._id);
  //     o.questions.forEach(function(ea) {
  //       if (ea._id === data._id) {
  //         angular.copy(data, ea);
  //       }
  //     });
  //   });
  // }
}

Questions.$inject = ['$http']

export default angular.module('bitfit.services.questions', [])
  .service('Questions', Questions)
  .name
