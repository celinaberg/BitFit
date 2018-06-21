import { compileLogger, runLogger } from "../cli.controller";
const MockExpressRequest = require("mock-express-request");
const MockExpressResponse = require("mock-express-response");
import mongoose from "mongoose";
import config from "../../../config/environment";
import { seedTestData, testLoggerMsgToBePrinted } from "../../../config/seed";
import Logger from "../../logger/logger.model";

beforeAll(() => {
  // Connect to database
  mongoose.Promise = global.Promise;
  mongoose.connect(config.mongo.uri, config.mongo.options);

  // Populate DB with sample data
  if (config.seedDB) {
    return seedTestData();
  }
});

test("Compile and Run Logger with Good Code", async () => {

  let testLogger = await Logger.findOne({className: "GoodCode"});

  let req = new MockExpressRequest({
    user: {
      id: "testUserId"
    },
    params: {
      id: testLogger._id
    }
  });

  let compileRes = new MockExpressResponse();

  let compileResponse = await compileLogger(req, compileRes);
  let compileResponseJson = compileResponse._getJSON();
  console.log("Compile Response Json: ", compileResponseJson);
  expect(compileResponseJson.error).toBe(false);
  expect(compileResponseJson.stdout).toBe("");
  expect(compileResponseJson.stderr).toBe("");

  let runRes = new MockExpressResponse();

  let runResponse = await runLogger(req, runRes);
  let runResponseJson = runResponse._getJSON();
  console.log("Run response Json: ", runResponseJson);
  expect(runResponseJson.error).toBe(false);
  expect(runResponseJson.stdout).toBe(testLoggerMsgToBePrinted);
  expect(runResponseJson.stderr).toBe("");
});
