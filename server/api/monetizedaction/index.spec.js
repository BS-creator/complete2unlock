'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var monetizedactionCtrlStub = {
  index: 'monetizedactionCtrl.index',
  show: 'monetizedactionCtrl.show',
  create: 'monetizedactionCtrl.create',
  upsert: 'monetizedactionCtrl.upsert',
  patch: 'monetizedactionCtrl.patch',
  destroy: 'monetizedactionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var monetizedactionIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './monetizedaction.controller': monetizedactionCtrlStub
});

describe('Monetizedaction API Router:', function() {
  it('should return an express router instance', function() {
    expect(monetizedactionIndex).to.equal(routerStub);
  });

  describe('GET /api/monetizedactions', function() {
    it('should route to monetizedaction.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'monetizedactionCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/monetizedactions/:id', function() {
    it('should route to monetizedaction.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'monetizedactionCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/monetizedactions', function() {
    it('should route to monetizedaction.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'monetizedactionCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/monetizedactions/:id', function() {
    it('should route to monetizedaction.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'monetizedactionCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/monetizedactions/:id', function() {
    it('should route to monetizedaction.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'monetizedactionCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/monetizedactions/:id', function() {
    it('should route to monetizedaction.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'monetizedactionCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
