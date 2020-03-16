'use strict';

describe('Component: PayoutComponent', function() {
  // load the controller's module
  beforeEach(module('complete2unlockApp.payout'));

  var PayoutComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PayoutComponent = $componentController('payout', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
