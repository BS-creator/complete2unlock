'use strict';

describe('Component: BookmarkletComponent', function() {
  // load the controller's module
  beforeEach(module('complete2unlockApp.bookmarklet'));

  var BookmarkletComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    BookmarkletComponent = $componentController('bookmarklet', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
