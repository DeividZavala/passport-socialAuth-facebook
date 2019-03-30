const passport = require("passport");
const User = require("../models/User");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: "FacebookApp ID",
      clientSecret: "Facebook Secret",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOne({ facebookId: profile.id })
        .then(user => {
          console.log(user);
          if (user) {
            return cb(null, user);
          }

          User.create({ facebookId: profile.id, displayName }).then(newUser => {
            console.log("perro", newUser);
            return cb(null, newUser);
          });
        })
        .catch(err => {
          cb(err);
        });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (!err) done(null, user);
    else done(err, null);
  });
});

module.exports = passport;
