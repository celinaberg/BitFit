'use strict';

describe('Controller: LessonsCtrl', function() {

  // load the controller's module
  beforeEach(module('bitfit'));

  var LessonsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    LessonsCtrl = $controller('LessonsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
