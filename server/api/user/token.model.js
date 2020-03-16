'use strict';
/*eslint no-invalid-this:0*/
mongoose.Promise = require('bluebird');
import mongoose, {
  Schema
} from 'mongoose';

var TokenSchema = new Schema({
  user: String,
  token: String,
  createdAt: {
    type: Date,
    expires: 60 * 60 * 24 * 14
  }
});

export default mongoose.model('Token', TokenSchema);
