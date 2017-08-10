import angular from "angular";

class Topics {
  constructor($http) {
    this.http = $http;
    this.o = {
      topics: []
    };
  }

  getAll() {
    return this.http.get("/api/topics").then(data => {
      angular.copy(data.data, this.o.topics);
      return data.data;
    });
  }

  create(topic) {
    return this.http.post("/api/topics", topic).then(data => {
      this.o.topics.push(data);
    });
  }

  get(id) {
    return this.http.get(`/api/topics/${id}`).then(res => res);
  }

  addQuestion(topicID, question) {
    return this.http.post(`/api/topics/${topicID}/questions`, question);
    // FIXME: add question to o object here explicitly??
  }

  editQuestion(id, question) {
    return this.http.put(`/api/questions/${id}`, question).then(data => {
      this.o.topics.forEach(ea => {
        if (ea._id === data.topic) {
          ea.questions.forEach(q => {
            if (q._id === data._id) {
              q = data;
            }
          });
        }
      });
    });
  }

  // must delete question, and delete reference to it in topic
  deleteQuestion(question, topicID) {
    this.http
      .post(`/api/topics/${topicID}/delquestion`, question)
      .then(data => {
        console.log("thenfully deleted q from topic");
        console.log(data);
      });
  }

  editTopic(id, topic) {
    topic.questions.forEach((ea, i) => {
      topic.questions[i] = ea._id;
    });

    return this.http.put(`/api/topics/${id}`, topic).then(data => {
      this.o.topics.forEach(ea => {
        if (ea._id === data._id) {
          angular.copy(data, ea);
        }
      });
    });
  }
}

Topics.$inject = ["$http"];

export default angular
  .module("bitfit.services.topics", [])
  .service("Topics", Topics).name;
