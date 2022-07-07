const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      db.query('SELECT * from users where id=?', jwt_payload.id)
      .then(user => {
        console.log('xxxxx');
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch( err => console.log(err) );
    })
  );
};