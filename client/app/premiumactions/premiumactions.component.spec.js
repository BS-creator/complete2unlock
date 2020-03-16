'use strict';

describe('Component: PremiumactionsComponent', function() {
  // load the controller's module
  beforeEach(module('complete2unlockApp.premiumactions'));

  var PremiumactionsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PremiumactionsComponent = $componentController('premiumactions', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
