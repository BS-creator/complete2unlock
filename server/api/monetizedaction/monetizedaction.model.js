'use strict';

import mongoose from 'mongoose';
import {
  registerEvents
} from './monetizedaction.events';

var MonetizedactionSchema = new mongoose.Schema({
  user: String,
  status: {
    type: String,
    enum: ['PENDING-PAYMENT', 'ACTIVE', 'COMPLETED'],
    default: 'PENDING-PAYMENT'
  },
  paymentId: String,
  completionsTotal: Number,
  completionsDone: {
    type: Number,
    default: 0
  },
  completionsPercentage: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0,
  },
  action: {
    channel: {
      type: String,
      enum: ['YOUTUBE', 'SNAPSHAT', 'MUSIC', 'FACEBOOK', 'INSTAGRAM', 'TWITTER', 'DISCORD', 'CUSTOM']
    },
    action: {
      type: String,
      enum: ['SUBSCRIBE', 'SUBSCRIBE_HITBELL', 'WATCH_VIDEO', 'COMMENT', 'LIKE_VIDEO',
        'DISLIKE_VIDEO', 'SNAP_ME', 'ADD_ON_SNAPCHAT', 'VIEW_SNAPSHAT_STORY', 'SHARE_SNAPSHAT_STORY',
        'SCREENSHOT_SNAPSHAT_STORY', 'STRAM_ON_SPOTIFY', 'STRAM_ON_SOUNDCLOUD', 'STRAM_ON_APPLEMUSIC',
        'SUBSCRIBE_LIKE', 'SHARE_VIDEO', 'LIKE', 'SHARE', 'REACT', 'FOLLOW', 'RETWEET', 'LIKE_COMMENT',
        'SHARE_WHATSAPP', 'JOIN_SERVER', null
      ]
    },
    customContent: String,
    actionUrl: String,
    order: Number,
    useAPI: Boolean
  }
});

MonetizedactionSchema.pre('save', function(next) {
  this.completionsPercentage = this.completionsDone / this.completionsTotal;
  if (this.completionsDone >= this.completionsTotal)
    this.status = 'COMPLETED';
  next();
});

registerEvents(MonetizedactionSchema);
export default mongoose.model('Monetizedaction', MonetizedactionSchema);
