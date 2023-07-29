var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
var users = require("./users")
require('dotenv').config()


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/inside',function(req, res, next) {
  res.render('inside');
});

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'email' , 'profile' ]
},async function verify(issuer, profile, cb) {
  
    console.log(profile);
  let loggedinUser = await users.findOne({email:profile.emails[0].value});
  if (loggedinUser){
    return cb(null,loggedinUser);
  }else{
   let newUser = users.create({name:profile.displayName, email:profile.emails[0].value})
   return cb(null,loggedinUser)
  }
  
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/inside',
  failureRedirect: '/login'
}));

 
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

module.exports = router;
