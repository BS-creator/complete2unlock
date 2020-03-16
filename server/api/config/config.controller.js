/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/configs              ->  index
 * POST    /api/configs              ->  create
 * GET     /api/configs/:id          ->  show
 * PUT     /api/configs/:id          ->  upsert
 * PATCH   /api/configs/:id          ->  patch
 * DELETE  /api/configs/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Config from './config.model';
import Link from '../link/link.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity.config || {});
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      entity.config = patches;
      entity.markModified('config');
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

export function latest(req, res) {
  return Link.find({
      //domain: req.query.hostname
  }).sort({createdAt: -1}).limit(5).exec()
    .then(links => links.map(link => {
      return {
        uniqueId: link.uniqueId,
        name: link.name
      }
    }))
    .then(links => {
      return res.status(200).json(links);
    })
}


// Gets a list of Configs
export function index(req, res) {
  return Config.findOne().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Upserts the given Config in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Config.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Config in the DB
export function update(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Config.findOne().exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Config from the DB
export function destroy(req, res) {
  return Config.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
