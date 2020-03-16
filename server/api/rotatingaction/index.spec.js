'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var rotatingactionCtrlStub = {
  index: 'rotatingactionCtrl.index',
  show: 'rotatingactionCtrl.show',
  create: 'rotatingactionCtrl.create',
  upsert: 'rotatingactionCtrl.upsert',
  patch: 'rotatingactionCtrl.patch',
  destroy: 'rotatingactionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var rotatingactionIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './rotatingaction.controller': rotatingactionCtrlStub
});

describe('Rotatingaction API Router:', function() {
  it('should return an express router instance', function() {
    expect(rotatingactionIndex).to.equal(routerStub);
  });

  describe('GET /api/rotatingactions', function() {
    it('should route to rotatingaction.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'rotatingactionCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/rotatingactions/:id', function() {
    it('should route to rotatingaction.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'rotatingactionCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/rotatingactions', function() {
    it('should route to rotatingaction.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'rotatingactionCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/rotatingactions/:id', function() {
    it('should route to rotatingaction.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'rotatingactionCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/rotatingactions/:id', function() {
    it('should route to rotatingaction.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'rotatingactionCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/rotatingactions/:id', function() {
    it('should route to rotatingaction.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'rotatingactionCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
