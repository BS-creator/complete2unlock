'use strict';

describe('Directive: ad', function() {
  // load the directive's module and view
  beforeEach(module('complete2unlockApp.ad'));
  beforeEach(module('components/ad/ad.html'));

  var element, scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<ad></ad>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).to.equal('this is the ad directive');
  }));
});
