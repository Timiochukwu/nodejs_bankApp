var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Admin = require("./models/admin");
var Customer = require("./models/customer")


module.exports = () => {
    
  passport.serializeUser(function(admin, done) {
    
    console.log(admin) 
    done(null, admin._id)
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const admin = await Admin.findById(id).exec();
      done(null, admin);
    } catch (err) {
      done(err)
    }
  })
  
  passport.use("local", new LocalStrategy({
    usernameField: 'input_email',
    passwordField: 'hash'
  },async function(input_email, hash, done) {
    try {
      const admin = await Admin.findOne({input_email: input_email}).exec();
      if (!admin) {
        return done(null, false, {
          message: 'No user has the email'
        });
      }
     admin.checkAdminPassword(hash, function(err, isMatch) {

        if (err) {
          return done(err);
        }

        if (isMatch) {
          return done(null, admin);
        } else {
          return done(null, false, {
            message: "Invalid Password"
          });
        }
      });
    } catch (err) {
      return done(err);
    }
  }));
};
