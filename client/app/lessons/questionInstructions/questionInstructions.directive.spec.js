'use strict';

describe('Directive: questionInstructions', function () {

  // load the directive's module and view
  beforeEach(module('its110App'));
  beforeEach(module('app/lessons/questionInstructions/question-instructions.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<question-instructions></question-instructions>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the question directive');
  }));
});