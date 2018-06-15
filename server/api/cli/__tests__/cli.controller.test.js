import { compileLogger, runLogger } from "../cli.controller";
const MockExpressRequest = require("mock-express-request");
const MockExpressResponse = require("mock-express-response");

test("My test", () => {
  let req = new MockExpressRequest({
    user: {
      id: "testUserId"
    },
    params: {
      id: "testLoggerId"
    }
  });
  let res = new MockExpressResponse();
  // expect(compileLogger(req, res)).toBe()
});
