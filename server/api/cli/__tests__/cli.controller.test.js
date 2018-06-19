import { compileLogger, runLogger } from "../cli.controller";
const MockExpressRequest = require("mock-express-request");
const MockExpressResponse = require("mock-express-response");
import mongoose from "mongoose";
import config from "../../../config/environment";
import { seedTestData } from "../../../config/seed";
import Logger from "../../logger/logger.model";

beforeAll(() => {
  // Connect to database
  mongoose.Promise = global.Promise;
  mongoose.connect(config.mongo.uri, config.mongo.options);
  console.log("config env: ", config.env);
  console.log("node env: ", process.env.NODE_ENV);

  // Populate DB with sample data
  if (config.seedDB) {
    return seedTestData();
  }
});

test("Compile Logger", async () => {
  let testLogger = await Logger.findOne({});
  let req = new MockExpressRequest({
    user: {
      id: "testUserId"
    },
    params: {
      id: testLogger._id
    }
  });
  let res = new MockExpressResponse();

  let compileResponse = await compileLogger(req, res);
  let compileResponseJson = compileResponse._getJSON();
  console.log("Compile Response Json: ", compileResponseJson);
  expect(compileResponseJson.error).toBe(false);
});
