'use strict';

describe('Service: getDBStuff', function () {

  // load the service's module
  beforeEach(module('its110App'));

  // instantiate service
  var getDBStuff;
  beforeEach(inject(function (_getDBStuff_) {
    getDBStuff = _getDBStuff_;
  }));

  it('should do something', function () {
    expect(!!getDBStuff).toBe(true);
  });

});
