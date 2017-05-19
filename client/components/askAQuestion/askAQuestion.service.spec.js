'use strict';

describe('Service: askAQuestion', function() {

  // load the service's module
  beforeEach(module('its110App'));

  // instantiate service
  var askAQuestion;
  beforeEach(inject(function(_askAQuestion_) {
    askAQuestion = _askAQuestion_;
  }));

  it('should do something', function() {
    expect(!!askAQuestion).toBe(true);
  });

});
