'use strict';

import mongoose from 'mongoose';
import {
  registerEvents
} from './link.events';

import Config from '../config/config.model';

import request from 'request';
var LinkSchema = new mongoose.Schema({
  user: String,
  name: String,
  title: String,
  buttonText: String,
  lockedUrl: String,
  uniqueId: String,
  oldId: Number,
  domain: String,
  shortUrl: {
    type: String
  },
  monetized: {
    type: Boolean,
    default: true
  },
  creditPending: {
    type: Number,
    default: 0
  },
  monetizedIPs: [{
    type: String
  }],
  creditPaid: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  completions: {
    type: Number,
    default: 0
  },
  completionCountries: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  actions: [{
    channel: {
      type: String,
      enum: ['YOUTUBE', 'SNAPSHAT', 'MUSIC', 'FACEBOOK', 'INSTAGRAM', 'TWITTER', 'DISCORD', 'CUSTOM', 'ROTATINGACTION']
    },
    action: {
      type: String,
      enum: ['SUBSCRIBE', 'SUBSCRIBE_HITBELL', 'WATCH_VIDEO', 'COMMENT', 'LIKE_VIDEO',
        'DISLIKE_VIDEO', 'SNAP_ME', 'ADD_ON_SNAPCHAT', 'VIEW_SNAPSHAT_STORY', 'SHARE_SNAPSHAT_STORY',
        'SCREENSHOT_SNAPSHAT_STORY', 'STRAM_ON_SPOTIFY', 'STRAM_ON_SOUNDCLOUD', 'STRAM_ON_APPLEMUSIC',
        'SUBSCRIBE_LIKE', 'SHARE_VIDEO', 'LIKE', 'SHARE', 'REACT', 'FOLLOW', 'RETWEET', 'LIKE_COMMENT',
        'SHARE_WHATSAPP', 'JOIN_SERVER', null, 'ROTATINGACTION']
    },
    customContent: String,
    actionUrl: String,
    order: Number,
    useAPI: Boolean
  }]
}, { usePushEach: true });

async function shortenUrl(serviceUrl, longUrl) {
  let response = await new Promise((resolve, reject) => {
    request(`${serviceUrl}/api?url=${longUrl}`, {json: true}, (error, response, body) => {
      if(error)
        return resolve();
      resolve(body);
    });
  });
  return response.short;
}


LinkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.domain)
    return next();
  this.assignRandomDomain()
    .then(next);
});

LinkSchema.post('init', function(doc, next) {
  //console.log('docs', doc, this)
  //if(!doc)
  //  return next();
  if (doc.domain)
    return next();
  doc.assignRandomDomain()
    .then(() => doc.save())
    .then(() => next());
})

LinkSchema.post('init', function(doc, next) {
  //console.log('docs', doc, this)
  //if(!doc)
  //  return next();
  if (doc.shortUrl)
    return next();
  shortenUrl('https://getthelink.xyz', `https://complete2unlock.com/${doc.uniqueId}`)
    .then(shortUrl => {
      doc.shortUrl = shortUrl;
      return doc.save();
    })
    .then(() => next());
});

LinkSchema.methods.assignRandomDomain = async function(){
  let config = await Config.findOne();
  let domains = config.config.domains || [];
  this.domain = domains[Math.floor(Math.random() * domains.length)];
}


LinkSchema.methods.public = function() {
  return this;
}

registerEvents(LinkSchema);
export default mongoose.model('Link', LinkSchema);
