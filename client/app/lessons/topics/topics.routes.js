import html from "./topics.html";

routes.$inject = ["$stateProvider"];

export default function routes($stateProvider) {
  $stateProvider.state("topics", {
    url: "/lessons/{id}",
    template: html,
    controller: "TopicsCtrl",
    authenticate: true,
    resolve: {
      topic: [
        "$stateParams",
        "Topics",
        function($stateParams, topics) {
          // gets current topic before controller loads
          return topics.get($stateParams.id);
        }
      ],
      topicPromiseTC: [
        "Topics",
        function(topics) {
          // gets all the topics before controller loads
          return topics.getAll();
        }
      ]
    }
  });
  $stateProvider.state("question", {
    url: "/lessons/{id}/{qid}",
    template: html,
    controller: "TopicsCtrl",
    authenticate: true,
    resolve: {
      topic: [
        "$stateParams",
        "Topics",
        function($stateParams, topics) {
          // gets current topic before controller loads
          return topics.get($stateParams.id);
        }
      ],
      topicPromiseTC: [
        "Topics",
        function(topics) {
          // gets all the topics before controller loads
          return topics.getAll();
        }
      ]
    }
  });
}
