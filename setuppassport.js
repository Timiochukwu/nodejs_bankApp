var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Admin = require("./models/admin");
var Customer = require("./models/customer")


module.exports = () => {
    
  passport.serializeUser(function(admin, done) {
    
    console.log(admin) 
    done(null, admin._id)
  });
  passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, admin) => {
     
      done(err, admin)
    })
  })
  
  passport.use("local", new LocalStrategy({
    usernameField: 'input_email',
    passwordField: 'hash'
  }, function(input_email, hash, done) {
    Admin.findOne({
      input_email: input_email
    }, function(err, admin) {
      if (err) {
        return done(err);
      }
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
    });
  }));
};

