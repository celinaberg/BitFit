
describe('Directive: questionInstructions', () => {
  // load the directive's module and view
  beforeEach(module('its110App'))
  beforeEach(module('app/lessons/questionInstructions/question-instructions.html'))

  let element,
    scope

  beforeEach(inject(($rootScope) => {
    scope = $rootScope.$new()
  }))

  it('should make hidden element visible', inject(($compile) => {
    element = angular.element('<question-instructions></question-instructions>')
    element = $compile(element)(scope)
    scope.$apply()
    expect(element.text()).toBe('this is the question directive')
  }))
})
