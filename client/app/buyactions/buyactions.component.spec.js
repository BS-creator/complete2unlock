'use strict';

describe('Component: BuyactionsComponent', function() {
  // load the controller's module
  beforeEach(module('complete2unlockApp.buyactions'));

  var BuyactionsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    BuyactionsComponent = $componentController('buyactions', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
