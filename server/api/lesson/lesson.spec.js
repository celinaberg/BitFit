/* eslint-env mocha */
import "should";
import app from "../../app";
import request from "supertest";

describe("GET /api/topics", () => {
  it("should respond with JSON array", done => {
    request(app)
      .get("/api/topics")
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});
