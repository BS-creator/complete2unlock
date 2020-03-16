'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newLink;

describe('Link API:', function() {
  describe('GET /api/links', function() {
    var links;

    beforeEach(function(done) {
      request(app)
        .get('/api/links')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          links = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(links).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/links', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/links')
        .send({
          name: 'New Link',
          info: 'This is the brand new link!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newLink = res.body;
          done();
        });
    });

    it('should respond with the newly created link', function() {
      expect(newLink.name).to.equal('New Link');
      expect(newLink.info).to.equal('This is the brand new link!!!');
    });
  });

  describe('GET /api/links/:id', function() {
    var link;

    beforeEach(function(done) {
      request(app)
        .get(`/api/links/${newLink._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          link = res.body;
          done();
        });
    });

    afterEach(function() {
      link = {};
    });

    it('should respond with the requested link', function() {
      expect(link.name).to.equal('New Link');
      expect(link.info).to.equal('This is the brand new link!!!');
    });
  });

  describe('PUT /api/links/:id', function() {
    var updatedLink;

    beforeEach(function(done) {
      request(app)
        .put(`/api/links/${newLink._id}`)
        .send({
          name: 'Updated Link',
          info: 'This is the updated link!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedLink = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedLink = {};
    });

    it('should respond with the updated link', function() {
      expect(updatedLink.name).to.equal('Updated Link');
      expect(updatedLink.info).to.equal('This is the updated link!!!');
    });

    it('should respond with the updated link on a subsequent GET', function(done) {
      request(app)
        .get(`/api/links/${newLink._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let link = res.body;

          expect(link.name).to.equal('Updated Link');
          expect(link.info).to.equal('This is the updated link!!!');

          done();
        });
    });
  });

  describe('PATCH /api/links/:id', function() {
    var patchedLink;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/links/${newLink._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Link' },
          { op: 'replace', path: '/info', value: 'This is the patched link!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedLink = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedLink = {};
    });

    it('should respond with the patched link', function() {
      expect(patchedLink.name).to.equal('Patched Link');
      expect(patchedLink.info).to.equal('This is the patched link!!!');
    });
  });

  describe('DELETE /api/links/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/links/${newLink._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when link does not exist', function(done) {
      request(app)
        .delete(`/api/links/${newLink._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
