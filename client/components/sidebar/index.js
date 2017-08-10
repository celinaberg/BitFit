import angular from "angular";

import SidebarController from "./sidebar.controller";
import Topics from "../topics/topics.service";
import template from "./sidebar.html";

export default angular
  .module("bitfit.components.sidebar", [Topics])
  .controller("SidebarController", SidebarController)
  .directive("sidebar", () => ({
    template,
    controller: "SidebarController"
  })).name;
