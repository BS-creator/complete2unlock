'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/

// All configurations will extend these options
// ============================================
var all = {
  baseUrl: process.env.BASE_URL || 'http://10.30.0.41:3000',
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',


  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: '3yDlmSTCWbnfSzGRTGeIP8JwDBTOOePJkHmiRi270OJJUyJrR7f8xSX2N06ABHLQmHH0ZgMoA6uQx8v3wkfQ609o7kvT4z1KNRDm',
    unlock: '90hFykXSrydXtSGNgSIVP53PwaNEI78eQdIww3k5rAi8oos9NTPEHw4b4c4tARdd0ewPiGHWxASSnYDwIWMqtohmlxn8EUkQcLGx',
    link: 'eLMm1DKlTedKYVcDMVFoZFixTL7r7DeBQE8GV0hMEqYgQgoVZRO483wihQ4iwrDso7yqdviemfPtc8sm1KXnetFBB9WrgNbtxmE1'
  },

  paypal: {
    mode: process.env.PAYPAL_MODE || 'sandbox',
    client_id: process.env.PAYPAL_ID || 'AbnFW_-vHJK-OKVaVQKQI3ma_FsMvN0eutZTbvue_EDIRj9tM8cnMG_VchZcKz71BToZdVKKNjb5KEAZ',
    client_secret: process.env.PAYPAL_SECRET || 'EM_Szg3yo2O9eCXvA3PT84G6h-5rXjJ0GKY7ObZTiVmHBlOabaj3GdJZ85Qk3voVSQGS0HE4ADOLZWRN'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '2407560462695984',
    clientSecret: process.env.FACEBOOK_SECRET || '2ff929061b55d04fb93b6b25d55e10d3',
    callbackURL: `${process.env.DOMAIN || ''}/auth/facebook/callback`
  },

  twitter: {
    clientID: process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL: `${process.env.DOMAIN || ''}/auth/twitter/callback`
  },

  google: {
    clientID: process.env.GOOGLE_ID || '587527613703-c01i12tnuvj4n3epmp9rkm23649hp35f.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || '7klQSef7ckIvbp6a4Rl0RjRM',
    callbackURL: `${process.env.DOMAIN || ''}/auth/google/callback`
  },

  monetizeSecret: 'krk8FvFvQzHuaBUQ6FnWUUDbZbuYDrZ5sJGWQb3TXFuP9DJaM4aPKtcbDb8weUsnRycvp93XNhZPnEKehzYPZPD94AfwZT59AV5A',

  payout: require('./shared')
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require(`./${process.env.NODE_ENV}.js`) || {});
