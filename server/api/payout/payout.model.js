'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './payout.events';

var PayoutSchema = new mongoose.Schema({
  user: String,
  createDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'PENDING',
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
  },
  amount: Number,
  paypalEmail: String
});

registerEvents(PayoutSchema);
export default mongoose.model('Payout', PayoutSchema);
