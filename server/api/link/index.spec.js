'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var linkCtrlStub = {
  index: 'linkCtrl.index',
  show: 'linkCtrl.show',
  create: 'linkCtrl.create',
  upsert: 'linkCtrl.upsert',
  patch: 'linkCtrl.patch',
  destroy: 'linkCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var linkIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './link.controller': linkCtrlStub
});

describe('Link API Router:', function() {
  it('should return an express router instance', function() {
    expect(linkIndex).to.equal(routerStub);
  });

  describe('GET /api/links', function() {
    it('should route to link.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'linkCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/links/:id', function() {
    it('should route to link.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'linkCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/links', function() {
    it('should route to link.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'linkCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/links/:id', function() {
    it('should route to link.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'linkCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/links/:id', function() {
    it('should route to link.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'linkCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/links/:id', function() {
    it('should route to link.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'linkCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
