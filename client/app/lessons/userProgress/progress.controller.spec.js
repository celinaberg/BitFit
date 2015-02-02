'use strict';

describe('Controller: ProgressCtrl', function () {

  // load the controller's module
  beforeEach(module('its110App'));

  var ProgressCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProgressCtrl = $controller('ProgressCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
