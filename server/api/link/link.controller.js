/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/links              ->  index
 * POST    /api/links              ->  create
 * GET     /api/links/:id          ->  show
 * PUT     /api/links/:id          ->  upsert
 * PATCH   /api/links/:id          ->  patch
 * DELETE  /api/links/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Link from './link.model';
import Config from '../config/config.model';
import Monetizedaction from '../monetizedaction/monetizedaction.model';
import User from '../user/user.model';
import geoip from '../../util/geoip';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import request from 'request';
import crypto from 'crypto';
import Rotatingaction from '../rotatingaction/rotatingaction.model';

const reCAPTCHA = require('recaptcha2');
const recaptcha = new reCAPTCHA({
  siteKey: '6Lcjy2UUAAAAAH23FPexexHjhGzP0ew1AsJolLf_',
  secretKey: '6Lcjy2UUAAAAAPHe98ODDli7su1GurkDCDJrZER0'
})

function isNormalInteger(str) {
  var n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}

function randomString(length) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      if (err)
        return reject();
      resolve(buf.toString('base64').replace(/\//g, '').replace(/\+/g, '').replace(/=/g, ''));
    });
  });
}


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return async function(entity) {
    try {
      if (entity) {
        return res.status(statusCode).json(entity);
      }
      return null;
    } catch (e) {
      console.log(e);
    }

  };
}

function getMonetizedActions(ip, link) {
  if (!link.monetized)
    return Promise.resolve([]);

  return Config.findOne().exec()
    .then((c) => {
      return Monetizedaction.find({
          status: 'ACTIVE',
          user: {
            $ne: link.user
          }
        })
        .sort({
          completionsPercentage: 1,
          views: 1
        })
        .exec()
        .then((actions) => {
          let rs;
          if (actions.length === 0 && !c.config.ogads)
            return randomString(30)
              .then((tmp) => {
                rs = tmp;
                return new Promise((resolve, reject) => {
                  request({
                    method: 'GET',
                    url: `https://mobverify.com/api/v1/?affiliateid=183944&ip=${ip}&limit=10&ctype=1&aff_sub3=${rs}`, //
                    json: true
                  }, (error, response, body) => {
                    if (error)
                      return reject(error);
                    resolve(body);
                  })
                })
              }).then((body) => {
                console.log('rs', rs);
                console.log('body', body);
                let offer = body.offers[Math.floor(Math.random() * body.offers.length)];
                return [{
                  channel: 'ads',
                  action: offer.name_short,
                  customContent: offer.adcopy,
                  actionUrl: offer.link,
                  order: -100,
                  useAPI: false,
                  token: jwt.sign({
                    offer: offer.offerid
                  }, config.monetizeSecret, {
                    expiresIn: '30m',
                    subject: rs
                  })
                }]
              });
          //
          //console.log('a', actions)
          if(actions.length > 0)
            actions = [actions[Math.floor(Math.random() * actions.length)]];
          //console.log([actions[Math.floor(Math.random() * actions.length)]]);
          return actions.map(action => {
            action.views++;
            action.save();

            return {
              channel: action.action.channel,
              action: action.action.action,
              customContent: action.action.customContent,
              actionUrl: action.action.actionUrl,
              order: action.action.order,
              useAPI: action.action.useAPI,
              token: jwt.sign({
                ip
              }, config.monetizeSecret, {
                expiresIn: '30m',
                subject: action._id.toString()
              })
            };
          });
        });
      });
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function getPopulateWithRotatingActions(link, actions) {
  let placeholders = actions.filter(action => action.channel === 'ROTATINGACTION');
  if(placeholders.length === 0)
    return actions;
  let rotatingactions = shuffle(await Rotatingaction.find({
    user: link.user
  }));
  for (let i = 0; i < placeholders.length; i++) {
    if(i >= rotatingactions.length) {
      actions.splice(actions.indexOf(placeholders[i]), 1);
      continue;
    }
    console.log(placeholders[i], rotatingactions[i]);
    placeholders[i].channel = rotatingactions[i].action.channel;
    placeholders[i].action = rotatingactions[i].action.action;
    placeholders[i].actionUrl = rotatingactions[i].action.actionUrl;
  }
  //console.log(actions);
  return actions;
}

function respondWithPublicResult(ip, res, statusCode) {
  statusCode = statusCode || 200;
  return async function(entity) {
    if(!entity)
        return null;
    entity.views++;
    entity.save();
    let user = await User.findById(entity.user).exec();
    if(user.referrerId) {
      let referrer = await User.findById(user.referrerId).exec();
      if(referrer) {
        referrer.affiliateStats.views++;
        await referrer.save();
      }
    }
    let monetizedactions = await getMonetizedActions(ip, entity);
    let actions = await getPopulateWithRotatingActions(entity, entity.actions);


    return res.status(statusCode).json({
      name: entity.name,
      title: entity.title,
      domain: entity.domain,
      buttonText: entity.buttonText,
      uniqueId: entity.uniqueId,
      actions,
      monetized: entity.monetized,
      linktoken: jwt.sign({}, config.secrets.link, {
        subject: entity.id,
        expiresIn: '30m',
        notBefore: 3 * entity.actions.length + 2,
      }),
      monetizedactions: monetizedactions
    });
  };
}

function verifyLinkToken(req, res) {
  return function(entity) {
    return new Promise((resolve, reject) => {
      jwt.verify(req.body.linktoken, config.secrets.link, (err, decoded) => {
        if (err || !decoded || entity.id !== decoded.sub)
          return res.status(200).json({
            url: entity.lockedUrl.indexOf('http') === -1 ? ('http://' + entity.lockedUrl) : entity.lockedUrl
          });
        //return reject('invalid link token');
        //return reject('invalid link id');
        return resolve(entity);
      })
    })
  }
}

function respondWithRedirect(req, res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      try {
        /*let gip = geoip.get(req.ip);
        let country = gip ? gip.country ? (gip.country['iso_code'] || 'UNKNOWN') : 'UNKNOWN' : 'UNKNOWN';*/
        let payout = 0;
        let country = req.headers['cf-ipcountry'] || 'UNKNOWN';

        //if (entity.monetized)
        //  payout = config.payout[country] || config.payout['DEFAULT'];

        if (!entity.completionCountries[country])
          entity.completionCountries[country] = 0;
        entity.completionCountries[country]++;
        entity.completions++;
        entity.creditPending += payout;
        entity.markModified('completionCountries');
        entity.save();
        if (entity.monetized && req.query.token) {
          let tokens = req.query.token.split(',');
          tokens.forEach((token) => {
            jwt.verify(token, config.monetizeSecret, (err, decoded) => {
              if (err || !decoded)
                return;
              if (decoded.ip !== req.headers['cf-connecting-ip'])
                return console.log('invalid ip', decoded.ip, req.headers['cf-connecting-ip']);
              Monetizedaction.findById(decoded.sub)
                .exec().then((action) => {
                  action.completionsDone++;
                  action.save();
                })
            })
          })
        }
        User.findById(entity.user).exec()
          .then((user) => {
            if (!user.completionCountries[country])
              user.completionCountries[country] = 0;
            user.completionCountries[country]++;
            //user.creditPending += payout;
            user.markModified('completionCountries');
            user.save();
          })
      } catch (e) {
        console.log(e);
      }
      return res.redirect(307, 'https://complete2unlock.com/' + entity.uniqueId);
    }
    return null;
  };
}

function respondWithUrlResponse(req, res, statusCode) {
  statusCode = statusCode || 200;
  return async function(entity) {
    if(!entity)
      return null;
    try {
      /*let gip = geoip.get(req.ip);
      let country = gip ? gip.country ? (gip.country['iso_code'] || 'UNKNOWN') : 'UNKNOWN' : 'UNKNOWN';*/
      let payout = 0;
      let country = req.headers['cf-ipcountry'] || 'UNKNOWN';

      if(entity.monetized)
        payout = config.payout[country] || config.payout['DEFAULT'];
      let checkFailed = entity.monetizedIPs.indexOf(req.headers['cf-connecting-ip']) !== -1 || !entity.monetized;
      if(!entity.completionCountries[country])
        entity.completionCountries[country] = 0;
      entity.completionCountries[country]++;
      entity.completions++;
      if(!checkFailed) {
        if (!entity.monetizedIPs)
          entity.monetizedIPs = [];
        entity.monetizedIPs.push(req.headers['cf-connecting-ip']);
        entity.creditPending += payout;
      }
      entity.markModified('completionCountries');
      await entity.save();
      if (entity.monetized && req.body.token) {
        let tokens = req.body.token.split(',');
        tokens.forEach((token) => {
          jwt.verify(token, config.monetizeSecret, (err, decoded) => {
            if (err || !decoded)
              return;
            if (decoded.ip !== req.headers['cf-connecting-ip'])
              return console.log('invalid ip', decoded.ip, req.headers['cf-connecting-ip']);
            if (checkFailed)
              return;
            Monetizedaction.findById(decoded.sub)
              .exec().then((action) => {
                action.completionsDone++;
                action.save();
              });
          });
        });
      }
      let user = await User.findById(entity.user).exec();
      if(!user.completionCountries[country])
        user.completionCountries[country] = 0;
      user.completionCountries[country]++;
      if(!checkFailed)
        user.creditPending += payout;
      user.markModified('completionCountries');
      user.save();
      console.log('user.referrerId)', user.referrerId);
      if(user.referrerId) {
        let referrer = await User.findById(user.referrerId).exec();
        console.log('referrer', referrer);
        if(referrer) {
          referrer.affiliateStats.completions++;
          await referrer.save();
        }
      }
    } catch (e) {
      console.log(e);
    }



    return res.status(statusCode).json({
      url: `https://${entity.domain}/redirect?url=` + encodeURIComponent(entity.lockedUrl.indexOf('http') === -1 ? ('http://' + entity.lockedUrl) : entity.lockedUrl)
    });
  };
}



function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      entity.name = patches.name;
      entity.title = patches.title;
      entity.buttonText = patches.buttonText;
      entity.lockedUrl = patches.lockedUrl;
      entity.actions = patches.actions;
      entity.monetized = patches.monetized;
      //jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log(err);
    res.status(statusCode).send(err);
  };
}

// Gets a list of Links
export function index(req, res) {
  return Link.find({
      user: req.user._id.toString()
    }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Link from the DB
export function show(req, res) {
  return Link.findOne({
      _id: req.params.id,
      user: req.user._id.toString()
    }).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function unlockAction(req, res) {
  let link;
  if (!isNormalInteger(req.params.action))
    return res.status(400).end();
  let actionId = parseInt(req.params.action);
  return Link.findOne({
      uniqueId: req.params.uniqueId
    }).exec()
    .then((tmp) => {
      link = tmp;
      if (!link)
        return res.status(404).end();
      if (actionId >= link.actions.length)
        return res.status(400).end();

    });
}

export function unlock(req, res) {
  return Link.findOne({
      uniqueId: req.params.uniqueId
    }).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithPublicResult(req.headers['cf-connecting-ip'], res))
    .catch(handleError(res));
}

export function complete(req, res) {
  return Link.findOne({
      uniqueId: req.params.uniqueId
    }).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithRedirect(req, res))
    .catch(handleError(res));
}

export function completePost(req, res) {
  return Link.findOne({
      uniqueId: req.params.uniqueId
    }).exec()
    .then(handleEntityNotFound(res))
    .then(verifyLinkToken(req, res))
    .then(respondWithUrlResponse(req, res))
    .catch(handleError(res));
}

// Creates a new Link in the DB
export function create(req, res) {
  let uniqueId = req.body.uniqueId || Math.round(Math.random() * 99999999999999);
  return Link.findOne({
      uniqueId: uniqueId
    }).exec()
    .then((link) => {
      if (link)
        return Promise.reject('url already in use');
      return Link.create({
        user: req.user._id.toString(),
        name: req.body.name,
        title: req.body.title,
        buttonText: req.body.buttonText,
        lockedUrl: req.body.lockedUrl,
        uniqueId: uniqueId,
        actions: req.body.actions,
        monetized: req.body.monetized
      })
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Link in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Link.findOneAndUpdate({
      _id: req.params.id
    }, req.body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Link in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Link.findOne({
      _id: req.params.id,
      user: req.user._id.toString()
    }).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Link from the DB
export function destroy(req, res) {
  return Link.findOne({
      _id: req.params.id,
      user: req.user._id.toString()
    }).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
