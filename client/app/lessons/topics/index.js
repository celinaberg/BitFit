import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import Topics from "../../../components/topics/topics.service";
import routing from "./topics.routes";
import TopicsController from "./topics.controller";
import Logging from "../../../components/logging/logging.service";
import NavBar from "../../../components/navbar";
import "textAngular/dist/textAngular-sanitize";
import SideBar from "../../../components/sidebar";

import "./topics.css";

export default angular
  .module("bitfit.topics", [uiRouter, Topics, Logging, NavBar, SideBar])
  .config(routing)
  .controller("TopicsCtrl", TopicsController).name;
