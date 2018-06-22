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

function getMockExpressRequestForLogger(logger) {
  return new MockExpressRequest({
    user: {
      id: "testUserId"
    },
    params: {
      id: logger._id
    }
  });
}

test("Compile Logger with Good Code", async () => {
  let goodCodeLogger = await Logger.findOne({
    className: "GoodCode"
  });

  let req = getMockExpressRequestForLogger(goodCodeLogger);
  let res = new MockExpressResponse();

  let response = await compileLogger(req, res);
  let responseJson = response._getJSON();
  console.log("Compile Response Json: ", responseJson);
  expect(responseJson).toMatchObject({
    error: false,
    stdout: "",
    stderr: ""
  });
});

test("Compile Logger with Bad Code", async () => {
  let badCodeLogger = await Logger.findOne({
    className: "BadCode"
  });

  let req = getMockExpressRequestForLogger(badCodeLogger);
  let res = new MockExpressResponse();

  let response = await compileLogger(req, res);
  let responseJson = response._getJSON();
  console.log("Compile Response Json: ", responseJson);
  expect(responseJson).toMatchObject({
    error: true,
    stdout: "",
    stderr: expect.stringMatching(/users\/\w+\/\w+\/BadCode\.c:\d+:\d+: error: /)
  });
});

test("Run Logger with Good Code", async () => {
  let goodCodeLogger = await Logger.findOne({
    className: "GoodCode"
  });

  let req = getMockExpressRequestForLogger(goodCodeLogger);
  let res = new MockExpressResponse();

  let response = await runLogger(req, res);
  let responseJson = response._getJSON();
  console.log("Run Response Json: ", responseJson);
  expect(responseJson).toMatchObject({
    error: false,
    stdout: testLoggerMsgToBePrinted,
    stderr: ""
  });
});
