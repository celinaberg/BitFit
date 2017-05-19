'use strict';

describe('Controller: AllQuestionsCtrl', function() {

  // load the controller's module
  beforeEach(module('bitfit'));

  var allQuestionsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    allQuestionsCtrl = $controller('AllQuestionsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
