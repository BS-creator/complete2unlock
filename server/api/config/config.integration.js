'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newConfig;

describe('Config API:', function() {
  describe('GET /api/configs', function() {
    var configs;

    beforeEach(function(done) {
      request(app)
        .get('/api/configs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          configs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(configs).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/configs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/configs')
        .send({
          name: 'New Config',
          info: 'This is the brand new config!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newConfig = res.body;
          done();
        });
    });

    it('should respond with the newly created config', function() {
      expect(newConfig.name).to.equal('New Config');
      expect(newConfig.info).to.equal('This is the brand new config!!!');
    });
  });

  describe('GET /api/configs/:id', function() {
    var config;

    beforeEach(function(done) {
      request(app)
        .get(`/api/configs/${newConfig._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          config = res.body;
          done();
        });
    });

    afterEach(function() {
      config = {};
    });

    it('should respond with the requested config', function() {
      expect(config.name).to.equal('New Config');
      expect(config.info).to.equal('This is the brand new config!!!');
    });
  });

  describe('PUT /api/configs/:id', function() {
    var updatedConfig;

    beforeEach(function(done) {
      request(app)
        .put(`/api/configs/${newConfig._id}`)
        .send({
          name: 'Updated Config',
          info: 'This is the updated config!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedConfig = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedConfig = {};
    });

    it('should respond with the updated config', function() {
      expect(updatedConfig.name).to.equal('Updated Config');
      expect(updatedConfig.info).to.equal('This is the updated config!!!');
    });

    it('should respond with the updated config on a subsequent GET', function(done) {
      request(app)
        .get(`/api/configs/${newConfig._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let config = res.body;

          expect(config.name).to.equal('Updated Config');
          expect(config.info).to.equal('This is the updated config!!!');

          done();
        });
    });
  });

  describe('PATCH /api/configs/:id', function() {
    var patchedConfig;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/configs/${newConfig._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Config' },
          { op: 'replace', path: '/info', value: 'This is the patched config!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedConfig = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedConfig = {};
    });

    it('should respond with the patched config', function() {
      expect(patchedConfig.name).to.equal('Patched Config');
      expect(patchedConfig.info).to.equal('This is the patched config!!!');
    });
  });

  describe('DELETE /api/configs/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/configs/${newConfig._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when config does not exist', function(done) {
      request(app)
        .delete(`/api/configs/${newConfig._id}`)
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
