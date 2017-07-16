import angular from 'angular'

class Topics {
  constructor ($http) {
    this.http = $http
    this.o = {
      topics: []
    }
  }

  getAll () {
    return this.http.get('/api/topics').success((data) => {
      angular.copy(data, this.o.topics)
    })
  }

  create (topic) {
    return this.http.post('/api/topics', topic).success((data) => {
      this.o.topics.push(data)
    })
  }

  get (id) {
    /* this worked fine - with $scope.topic = topic; after the js resolve
    return this.http.get('/api/topics/' + id).then(function(res){
      return res.data;
    }); */
    return this.http.get(`/api/topics/${id}`).success(res => res)
  }

  addQuestion (topicID, question) {
    return this.http.post(`/api/topics/${topicID}/questions`, question)
    // FIXME: add question to o object here explicitly??
  }

  editQuestion (id, question) {
    return this.http.put(`/api/questions/${id}`, question).success((data) => {
      this.o.topics.forEach((ea) => {
        if (ea._id === data.topic) {
          ea.questions.forEach((q) => {
            if (q._id === data._id) {
              q = data
            }
          })
        }
      })
    })
  }

  // must delete question, and delete reference to it in topic
  deleteQuestion (question, topicID) {
    this.http.post(`/api/topics/${topicID}/delquestion`, question).success((data) => {
      // o.topics.forEach(function(ea) {
      console.log('successfully deleted q from topic')
      console.log(data)
      // })
    })
    // this.http.delete('/api/questions/' + question._id); // is this correct? FIXME
  }

  editTopic (id, topic) {
    topic.questions.forEach((ea, i) => {
      topic.questions[i] = ea._id
    })

    return this.http.put(`/api/topics/${id}`, topic).success((data) => {
      // var index = o.topics.indexOf(data._id);
      this.o.topics.forEach((ea) => {
        if (ea._id === data._id) {
          angular.copy(data, ea)
        }
      })
    })
  }
}

export default angular.module('bitfit.services.topics', ['$http'])
  .service('Topics', Topics)
  .name
