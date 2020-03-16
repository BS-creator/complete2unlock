import passport from 'passport';
import {Strategy as RememberMeStrategy} from 'passport-remember-me';
import Token from '../../api/user/token.model';
import User from '../../api/user/user.model';
import issue from './issue';
import {
  signToken
} from '../auth.service';


function verify(token, done) {
  Token.findOne({
    token
  })
    .then(t => {
      if(!t) {
        return done(null, false);
      }
      return User.findById(t.user);
    })
    .then(user => {
      done(null, user);
    })
    .catch(err => done(err));
}


export function setup(User) {
}

export function middleware(req, res, next) {
  if(req.headers.authorization) {
    return next();
  }
  if(req.query && req.query.hasOwnProperty('access_token')) {
    return next();
  }
  if(req.cookies.token) {
    return next();
  }
  if(!req.cookies['remember_me']) {
    return next();
  }
  verify(req.cookies['remember_me'], (err, user) => {
    if(err || !user)
      return next();
    res.cookie('token', signToken(user._id, user.role));
    next();
  });
  //passport.authenticate('remember-me')(req, res, next)
}
