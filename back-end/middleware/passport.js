const { ExtractJwt, Strategy } = require("passport-jwt");
const { People } = require("../models");
const CONFIG = require("../config/config");
const { to } = require("../services/util.service");

module.exports = function (passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = CONFIG.jwt_encryption;

  passport.use(
    new Strategy(opts, async function (jwt_payload, done) {
      let err, user;
      console.log("---jwt_payload", jwt_payload);
      [err, user] = await to(People.findById(jwt_payload.user_id));

      if (err) return done(err, false);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
  );
};
