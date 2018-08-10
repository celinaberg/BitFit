import { compileLogger, runLogger, runExecutablesAsCompedExecUser } from "../cli.controller";
const MockExpressRequest = require("mock-express-request");
const MockExpressResponse = require("mock-express-response");
import mongoose from "mongoose";
import config from "../../../config/environment";
import { seedTestData, testLoggerMsgToBePrinted } from "../../../config/seed";
import Logger from "../../logger/logger.model";
import test from "ava";

test.before(async t => {
  // Connect to database
  mongoose.Promise = global.Promise;
  await mongoose.connect(config.mongo.uri, config.mongo.options);

  // Populate DB with sample data
  if (config.seedDB) {
    await seedTestData();
  }
});

function compareResponseJSONs(actual, expected, t) {
  t.is(actual.error, expected.error);
  if (expected.stdout instanceof RegExp) {
    t.regex(actual.stdout, expected.stdout);
  } else {
    t.is(actual.stdout, expected.stdout);
  }
  if (expected.stderr instanceof RegExp) {
    t.regex(actual.stderr, expected.stderr);
  } else {
    t.is(actual.stderr, expected.stderr);
  }
}

const goodCodeCompileResponseJSON = {
  error: false,
  stdout: "",
  stderr: ""
};

const badCodeCompileResponseJSON = {
  error: true,
  stdout: "",
  stderr: /Error: Command failed: gcc "users\/\w+\/\w+\/\w+\.c" -o "users\/\w+\/\w+\/\w+" -lm/
  // stderr: /users\/\w+\/\w+\/BadCode\.c:\d+:\d+: error: unknown type name/
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
  stderr: /timeout: failed to run command ‘\.\/users\/\w+\/\w+\/BadCode’: No such file or directory/
};

const infiniteLoopCodeRunResponseJSON = {
  error: true,
  stdout: /Timed Out!/,
  stderr: ""
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

test("Compile Logger with Good Code", async t => {
  let goodCodeLogger = await Logger.findOne({
    className: "GoodCode"
  });

  let req = getMockExpressRequestForLogger(goodCodeLogger);
  let res = new MockExpressResponse();

  let response = await compileLogger(req, res);
  let responseJson = response._getJSON();
  compareResponseJSONs(responseJson, goodCodeCompileResponseJSON, t);
});

test("Compile Logger with Bad Code", async t => {
  let badCodeLogger = await Logger.findOne({
    className: "BadCode"
  });

  let req = getMockExpressRequestForLogger(badCodeLogger);
  let res = new MockExpressResponse();

  let response = await compileLogger(req, res);
  let responseJson = response._getJSON();
  compareResponseJSONs(responseJson, badCodeCompileResponseJSON, t);
});

test("Compile Logger with Infinite Loop Code", async t => {
  let infiniteLoopCodeLogger = await Logger.findOne({
    className: "InfiniteLoopCode"
  });

  let req = getMockExpressRequestForLogger(infiniteLoopCodeLogger);
  let res = new MockExpressResponse();

  let response = await compileLogger(req, res);
  let responseJson = response._getJSON();
  compareResponseJSONs(responseJson, infiniteLoopCodeCompileResponseJSON, t);
});

test("Compile Logger Load Test", async t => {
  // Note: On average this test requires:
  // - 15 seconds to run with 2 simultaneous calls to `compileLogger`
  // - 30 seconds to run with 5 simultaneous calls to `compileLogger`
  // - 40 seconds to run with 10 simultaneous calls to `compileLogger`
  // - 100 seconds to run with 30 simultaneous calls to `compileLogger`
  // - 300 seconds to run with 100 simultaneous calls to `compileLogger`
  // Change `numberOfRequests` and `testRunTimeInSeconds` as desired.
  const numberOfRequests = 200;
  const testRunTimeInSeconds = 600;
  // jest.setTimeout(testRunTimeInSeconds * 1000);

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

  t.plan(numberOfRequests * 3);

  let startTime = Date.now();

  // execute a bunch of calls to compileLogger
  for (let i = 0; i < numberOfRequests; i++) {
    let randomIndex = Math.floor(Math.random() * 3);  // random integer between 0 and 2 inclusive
    let req = getMockExpressRequestForLogger(allLoggers[randomIndex]);
    let res = new MockExpressResponse();
    outputResponsePromises[i] = compileLogger(req, res).then(response => {
      let responseJson = response._getJSON();
      compareResponseJSONs(responseJson, allCompileResponseJSONs[randomIndex], t);
    }).catch(err => {
      throw err;
    });
  }

  await Promise.all(outputResponsePromises).then(_ => {
    let endTime = Date.now();
    let timeElapsed = (endTime - startTime) / 1000;
    console.log(`We're done! It took ${timeElapsed} seconds to complete ${numberOfRequests} simultaneous calls to compileLogger.`);
  });;
});

test("Run Logger with Good Code", async t => {
  let goodCodeLogger = await Logger.findOne({
    className: "GoodCode"
  });

  let req = getMockExpressRequestForLogger(goodCodeLogger);
  let res = new MockExpressResponse();

  let compileResponse = await compileLogger(req, res);
  res = new MockExpressResponse();
  let response = await runLogger(req, res);
  let responseJson = response._getJSON();
  compareResponseJSONs(responseJson, goodCodeRunResponseJSON, t);
});

test("Run Logger with Bad Code", async t => {
  let badCodeLogger = await Logger.findOne({
    className: "BadCode"
  });

  let req = getMockExpressRequestForLogger(badCodeLogger);
  let res = new MockExpressResponse();

  let compileResponse = await compileLogger(req, res);
  res = new MockExpressResponse();
  let response = await runLogger(req, res);
  let responseJson = response._getJSON();
  compareResponseJSONs(responseJson, badCodeRunResponseJSON, t);
});

test("Run Logger with Infinite Loop Code", async t => {
  // jest.setTimeout(25000);
  let infiniteLoopCodeLogger = await Logger.findOne({
    className: "InfiniteLoopCode"
  });

  let req = getMockExpressRequestForLogger(infiniteLoopCodeLogger);
  let res = new MockExpressResponse();

  let compileResponse = await compileLogger(req, res);
  res = new MockExpressResponse();
  let response = await runLogger(req, res);
  let responseJson = response._getJSON();
  compareResponseJSONs(responseJson, infiniteLoopCodeRunResponseJSON, t);
});

test("Run Logger Load Test", async t => {
  // Note: On average this test requires:
  // - 20 seconds to run with 2 simultaneous calls to `runLogger`
  // - 40 seconds to run with 5 simultaneous calls to `runLogger`
  // - 60 seconds to run with 10 simultaneous calls to `runLogger`
  // - 200 seconds to run with 30 simultaneous calls to `runLogger`
  // - 600 seconds to run with 100 simultaneous calls to `runLogger`
  // Change `numberOfRequests` and `testRunTimeInSeconds` as desired.
  const numberOfRequests = 200;
  const testRunTimeInSeconds = 1200;
  // jest.setTimeout(testRunTimeInSeconds * 1000);

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

  t.plan(numberOfRequests * 3);

  // execute compileLogger for each logger in advance of calling runLogger
  for (let i = 0; i < 3; i++) {
    let req = getMockExpressRequestForLogger(allLoggers[i]);
    let res = new MockExpressResponse();
    await compileLogger(req, res);
  }

  let startTime = Date.now();

  // execute a bunch of calls to runLogger
  for (let i = 0; i < numberOfRequests; i++) {
    let randomIndex = Math.floor(Math.random() * 3);  // random integer between 0 and 2 inclusive
    let req = getMockExpressRequestForLogger(allLoggers[randomIndex]);
    let res = new MockExpressResponse();
    outputResponsePromises[i] = runLogger(req, res).then(response => {
      let responseJson = response._getJSON();
      compareResponseJSONs(responseJson, allRunResponseJSONs[randomIndex], t);
    }).catch(err => {
      throw err;
    });
  }

  await Promise.all(outputResponsePromises).then(_ => {
    let endTime = Date.now();
    let timeElapsed = (endTime - startTime) / 1000;
    console.log(`We're done! It took ${timeElapsed} seconds to complete ${numberOfRequests} simultaneous calls to runLogger.`);
  });
});

test("Compile And Run Logger Load Test", async t => {
  // Note: On average this test requires:
  // - 20 seconds to run with 2 simultaneous calls to `runLogger`
  // - 40 seconds to run with 5 simultaneous calls to `runLogger`
  // - 60 seconds to run with 10 simultaneous calls to `runLogger`
  // - 200 seconds to run with 30 simultaneous calls to `runLogger`
  // - 600 seconds to run with 100 simultaneous calls to `runLogger`
  // Change `numberOfRequests` and `testRunTimeInSeconds` as desired.
  const numberOfRequests = 200;
  const testRunTimeInSeconds = 600;
  // jest.setTimeout(testRunTimeInSeconds * 1000);

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

  t.plan(numberOfRequests * 3);

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
      compareResponseJSONs(responseJson, allResponseJSONs[randomIndex], t);
    }).catch(err => {
      throw err;
    });
  }

  await Promise.all(outputResponsePromises).then(_ => {
    let endTime = Date.now();
    let timeElapsed = (endTime - startTime) / 1000;
    console.log(`We're done! It took ${timeElapsed} seconds to complete ${numberOfRequests} simultaneous calls to compileLogger and runLogger.`);
  });
});

test("Run Logger Infinite Code Load Test", async t => {
  // Note: On average this test requires:
  // - 20 seconds to run with 2 simultaneous calls to `runLogger`
  // - 40 seconds to run with 5 simultaneous calls to `runLogger`
  // - 60 seconds to run with 10 simultaneous calls to `runLogger`
  // - 200 seconds to run with 30 simultaneous calls to `runLogger`
  // - 600 seconds to run with 100 simultaneous calls to `runLogger`
  // Change `numberOfRequests` and `testRunTimeInSeconds` as desired.
  const numberOfRequests = 200;
  const testRunTimeInSeconds = 1200;
  // jest.setTimeout(testRunTimeInSeconds * 1000);

  let infiniteLoopCodeLogger = await Logger.findOne({
    className: "InfiniteLoopCode"
  });

  const outputResponsePromises = [];

  t.plan(numberOfRequests * 3);

  // execute compileLogger for infiniteLoopCodeLogger in advance of calling runLogger
  let req = getMockExpressRequestForLogger(infiniteLoopCodeLogger);
  let res = new MockExpressResponse();
  await compileLogger(req, res);

  let startTime = Date.now();

  // execute a bunch of calls to runLogger
  for (let i = 0; i < numberOfRequests; i++) {
    res = new MockExpressResponse();
    outputResponsePromises[i] = runLogger(req, res).then(response => {
      let responseJson = response._getJSON();
      compareResponseJSONs(responseJson, infiniteLoopCodeRunResponseJSON, t);
    }).catch(err => {
      throw err;
    });
  }
  await Promise.all(outputResponsePromises).then(_ => {
    let endTime = Date.now();
    let timeElapsed = (endTime - startTime) / 1000;
    console.log(`We're done! It took ${timeElapsed} seconds to complete ${numberOfRequests} simultaneous calls to runLogger with InfiniteLoopCode.`);
  });
});
