'use strict';

describe('Controller: EditContentCtrl', function() {

  // load the controller's module
  beforeEach(module('its110App'));

  var EditContentCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    EditContentCtrl = $controller('EditContentCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
