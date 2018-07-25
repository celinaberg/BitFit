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

const goodCodeCompileResponseJSON = {
  error: false,
  stdout: "",
  stderr: ""
};

const badCodeCompileResponseJSON = {
  error: true,
  stdout: "",
  stderr: expect.stringMatching(/users\/\w+\/\w+\/BadCode\.c:\d+:\d+: error: /)
};

const infiniteLoopCodeCompileResponseJSON = goodCodeCompileResponseJSON;

const goodCodeRunResponseJSON = {
  error: false,
  stdout: testLoggerMsgToBePrinted,
  stderr: ""
};

const badCodeRunResponseJSON = {
  error: true,
  stdout: "",
  stderr: expect.stringMatching(/sudo: users\/\w+\/\w+\/BadCode: command not found/)
};

const infiniteLoopCodeRunResponseJSON = {
  error: true,
  stdout: "",
  stderr: expect.stringMatching(/TimeoutError/)
};

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
  expect(responseJson).toMatchObject(goodCodeCompileResponseJSON);
});

test("Compile Logger with Bad Code", async () => {
  let badCodeLogger = await Logger.findOne({
    className: "BadCode"
  });

  let req = getMockExpressRequestForLogger(badCodeLogger);
  let res = new MockExpressResponse();

  let response = await compileLogger(req, res);
  let responseJson = response._getJSON();
  expect(responseJson).toMatchObject(badCodeCompileResponseJSON);
});

test("Compile Logger with Infinite Loop Code", async () => {
  let infiniteLoopCodeLogger = await Logger.findOne({
    className: "InfiniteLoopCode"
  });

  let req = getMockExpressRequestForLogger(infiniteLoopCodeLogger);
  let res = new MockExpressResponse();

  let response = await compileLogger(req, res);
  let responseJson = response._getJSON();
  expect(responseJson).toMatchObject({
    error: false,
    stdout: "",
    stderr: ""
  });
});

test("Compile Logger Load Test", async () => {
  // Note: On average this test requires:
  // - 15 seconds to run with 2 simultaneous calls to `compileLogger`
  // - 30 seconds to run with 5 simultaneous calls to `compileLogger`
  // - 40 seconds to run with 10 simultaneous calls to `compileLogger`
  // - 100 seconds to run with 30 simultaneous calls to `compileLogger`
  // - 300 seconds to run with 100 simultaneous calls to `compileLogger`
  // Change `numberOfRequests` and `testRunTimeInSeconds` as desired.
  const numberOfRequests = 50;
  const testRunTimeInSeconds = 600;
  jest.setTimeout(testRunTimeInSeconds * 1000);

  let goodCodeLogger = await Logger.findOne({
    className: "GoodCode"
  });
  let badCodeLogger = await Logger.findOne({
    className: "BadCode"
  });
  let infiniteLoopCodeLogger = await Logger.findOne({
    className: "InfiniteLoopCode"
  });

  const allLoggers = [goodCodeLogger, badCodeLogger, infiniteLoopCodeLogger];
  const allCompileResponseJSONs = [goodCodeCompileResponseJSON, badCodeCompileResponseJSON, infiniteLoopCodeCompileResponseJSON];

  const outputResponsePromises = [];

  expect.assertions(numberOfRequests);

  // execute a bunch of calls to compileLogger
  for (let i = 0; i < numberOfRequests; i++) {
    let randomIndex = Math.floor(Math.random() * 3);  // random integer between 0 and 2 inclusive
    let req = getMockExpressRequestForLogger(allLoggers[randomIndex]);
    let res = new MockExpressResponse();
    outputResponsePromises[i] = compileLogger(req, res).then(response => {
      let responseJson = response._getJSON();
      expect(responseJson).toMatchObject(allCompileResponseJSONs[randomIndex]);
    }).catch(err => {
      throw err;
    });
  }

  return Promise.all(outputResponsePromises);
});

test("Run Logger with Good Code", async () => {
  let goodCodeLogger = await Logger.findOne({
    className: "GoodCode"
  });

  let req = getMockExpressRequestForLogger(goodCodeLogger);
  let res = new MockExpressResponse();

  let compileResponse = await compileLogger(req, res);
  res = new MockExpressResponse();
  let response = await runLogger(req, res);
  let responseJson = response._getJSON();
  expect(responseJson).toMatchObject(goodCodeRunResponseJSON);
});

test("Run Logger with Bad Code", async () => {
  let badCodeLogger = await Logger.findOne({
    className: "BadCode"
  });

  let req = getMockExpressRequestForLogger(badCodeLogger);
  let res = new MockExpressResponse();

  let compileResponse = await compileLogger(req, res);
  res = new MockExpressResponse();
  let response = await runLogger(req, res);
  let responseJson = response._getJSON();
  expect(responseJson).toMatchObject(badCodeRunResponseJSON);
});

test("Run Logger with Infinite Loop Code", async () => {
  jest.setTimeout(15000);
  let infiniteLoopCodeLogger = await Logger.findOne({
    className: "InfiniteLoopCode"
  });

  let req = getMockExpressRequestForLogger(infiniteLoopCodeLogger);
  let res = new MockExpressResponse();

  let compileResponse = await compileLogger(req, res);
  res = new MockExpressResponse();
  let response = await runLogger(req, res);
  let responseJson = response._getJSON();
  expect(responseJson).toMatchObject(infiniteLoopCodeRunResponseJSON);
});

test("Run Logger Load Test", async () => {
  // Note: On average this test requires:
  // - 20 seconds to run with 2 simultaneous calls to `runLogger`
  // - 40 seconds to run with 5 simultaneous calls to `runLogger`
  // - 60 seconds to run with 10 simultaneous calls to `runLogger`
  // - 200 seconds to run with 30 simultaneous calls to `runLogger`
  // - 600 seconds to run with 100 simultaneous calls to `runLogger`
  // Change `numberOfRequests` and `testRunTimeInSeconds` as desired.
  const numberOfRequests = 50;
  const testRunTimeInSeconds = 600;
  jest.setTimeout(testRunTimeInSeconds * 1000);

  let goodCodeLogger = await Logger.findOne({
    className: "GoodCode"
  });
  let badCodeLogger = await Logger.findOne({
    className: "BadCode"
  });
  let infiniteLoopCodeLogger = await Logger.findOne({
    className: "InfiniteLoopCode"
  });

  const allLoggers = [goodCodeLogger, badCodeLogger, infiniteLoopCodeLogger];
  const allRunResponseJSONs = [goodCodeRunResponseJSON, badCodeRunResponseJSON, infiniteLoopCodeRunResponseJSON];

  const outputResponsePromises = [];

  expect.assertions(numberOfRequests);

  // execute compileLogger for each logger in advance of calling runLogger
  for (let i = 0; i < 3; i++) {
    let req = getMockExpressRequestForLogger(allLoggers[i]);
    let res = new MockExpressResponse();
    await compileLogger(req, res);
  }

  // execute a bunch of calls to runLogger
  for (let i = 0; i < numberOfRequests; i++) {
    let randomIndex = Math.floor(Math.random() * 3);  // random integer between 0 and 2 inclusive
    let req = getMockExpressRequestForLogger(allLoggers[randomIndex]);
    let res = new MockExpressResponse();
    outputResponsePromises[i] = runLogger(req, res).then(response => {
      let responseJson = response._getJSON();
      expect(responseJson).toMatchObject(allRunResponseJSONs[randomIndex]);
    }).catch(err => {
      throw err;
    });
  }

  return Promise.all(outputResponsePromises);
});

test("Compile And Run Logger Load Test", async () => {
  // Note: On average this test requires:
  // - 20 seconds to run with 2 simultaneous calls to `runLogger`
  // - 40 seconds to run with 5 simultaneous calls to `runLogger`
  // - 60 seconds to run with 10 simultaneous calls to `runLogger`
  // - 200 seconds to run with 30 simultaneous calls to `runLogger`
  // - 600 seconds to run with 100 simultaneous calls to `runLogger`
  // Change `numberOfRequests` and `testRunTimeInSeconds` as desired.
  const numberOfRequests = 50;
  const testRunTimeInSeconds = 600;
  jest.setTimeout(testRunTimeInSeconds * 1000);

  let goodCodeLogger = await Logger.findOne({
    className: "GoodCode"
  });
  let badCodeLogger = await Logger.findOne({
    className: "BadCode"
  });
  let infiniteLoopCodeLogger = await Logger.findOne({
    className: "InfiniteLoopCode"
  });

  const allLoggers = [goodCodeLogger, badCodeLogger, infiniteLoopCodeLogger, goodCodeLogger, badCodeLogger, infiniteLoopCodeLogger];
  const allResponseJSONs = [
    goodCodeCompileResponseJSON, badCodeCompileResponseJSON, infiniteLoopCodeCompileResponseJSON,
    goodCodeRunResponseJSON, badCodeRunResponseJSON, infiniteLoopCodeRunResponseJSON
  ];
  const runOrCompileFunctions = [compileLogger, runLogger];

  const outputResponsePromises = [];

  expect.assertions(numberOfRequests);

  // execute compileLogger for each logger in advance of calling runLogger
  for (let i = 0; i < 3; i++) {
    let req = getMockExpressRequestForLogger(allLoggers[i]);
    let res = new MockExpressResponse();
    await compileLogger(req, res);
  }

  let startTime = Date.now();

  // execute a bunch of calls to runLogger
  for (let i = 0; i < numberOfRequests; i++) {
    let randomIndex = Math.floor(Math.random() * 6);  // random integer between 0 and 5 inclusive
    let runOrCompileIndex = Math.floor(randomIndex / 3);  // random choice of 0 or 1
    let runOrCompile = runOrCompileFunctions[runOrCompileIndex];  // random choice of `compileLogger` or `runLogger`
    let req = getMockExpressRequestForLogger(allLoggers[randomIndex]);
    let res = new MockExpressResponse();
    outputResponsePromises[i] = runOrCompile(req, res).then(response => {
      let responseJson = response._getJSON();
      expect(responseJson).toMatchObject(allResponseJSONs[randomIndex]);
    }).catch(err => {
      throw err;
    });
  }

  return Promise.all(outputResponsePromises).then(_ => {
    let endTime = Date.now();
    let timeElapsed = (endTime - startTime) / 1000;
    console.log(`We're done! It took ${timeElapsed} seconds to complete ${numberOfRequests} calls.`);
  });
});
