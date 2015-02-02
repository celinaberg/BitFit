'use strict';

describe('Directive: userProgress', function () {

  // load the directive's module and view
  beforeEach(module('its110App'));
  beforeEach(module('app/lessons/userProgress/userProgress.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<user-progress></user-progress>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the userProgress directive');
  }));
});