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
      console.log(data.data)
      angular.copy(data.data, this.o.questions)
      return this.o.questions
    })
  }

  create (question) {
    console.log('questions service create question')
    return this.http.post('/api/questions', question).then((data) => {
      this.o.questions.push(data.data)
      return data.data
    })
  }

  import (questions) {
    return this.http.post('/api/questions/import', questions).then((data) => {
      angular.extend(this.o.questions, data.data)
      return data.data
    })
  }

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
}

Questions.$inject = ['$http']

export default angular.module('bitfit.services.questions', [])
  .service('Questions', Questions)
  .name
