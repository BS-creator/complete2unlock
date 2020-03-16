'use strict';

describe('Component: AffiliateComponent', function() {
  // load the controller's module
  beforeEach(module('complete2unlockApp.affiliate'));

  var AffiliateComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AffiliateComponent = $componentController('affiliate', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
