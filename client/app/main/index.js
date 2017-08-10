import angular from "angular";
import uiRouter from "@uirouter/angularjs";
import NavBar from "../../components/navbar";

import routing from "./main.routes";
import MainController from "./main.controller";

import "./main.css";

export default angular
  .module("bitfit.main", [uiRouter, NavBar])
  .config(routing)
  .controller("MainCtrl", MainController).name;
