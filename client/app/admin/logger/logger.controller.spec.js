'use strict';

describe('Controller: loggerCtrl', function() {

  // load the controller's module
  beforeEach(module('its110App'));

  var loggerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    loggerCtrl = $controller('loggerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
