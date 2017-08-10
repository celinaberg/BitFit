import template from "./admin.html";

routes.$inject = ["$stateProvider"];

export default function routes($stateProvider) {
  $stateProvider.state("admin", {
    url: "/admin",
    template,
    controller: "AdminCtrl",
    authenticate: true,
    resolve: {
      topicPromiseAC: [
        "Topics",
        function(topics) {
          // gets all the topics before controller loads
          return topics.getAll();
        }
      ]
    }
  });
}
