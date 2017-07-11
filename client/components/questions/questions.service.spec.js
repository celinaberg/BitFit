'use strict';

describe('Service: questions', function () {
  // load the service's module
  beforeEach(module('its110App'));

  // instantiate service
  var questions;
  beforeEach(inject(function (_questions_) {
    questionss = _questions_;
  }));

  it('should do something', function () {
    expect(!!questions).toBe(true);
  });
});
