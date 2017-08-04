/* eslint-env mocha */
/* global inject expect */
import angular from 'angular'

describe('Directive: background', () => {
  // load the directive's module and view
  beforeEach(module('bitfit.lessons.instructions'))
  beforeEach(module('app/lessons/background/background.html'))

  let element,
    scope

  beforeEach(inject(($rootScope) => {
    scope = $rootScope.$new()
  }))

  it('should make hidden element visible', inject(($compile) => {
    element = angular.element('<background></background>')
    element = $compile(element)(scope)
    scope.$apply()
    expect(element.text()).toBe('this is the background directive')
  }))
})
