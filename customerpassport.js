var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Customer = require("./models/customer")


////CUSTOMER////////////

module.exports = () => {
    
  passport.serializeUser(function(customer, done) {
    // console.log(customer)
    done(null, customer._id)
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const customer = await Customer.findById(id);
      done(null, customer);
    } catch (err) {
      done(err)
    }
  })

  
  
  passport.use("localCustomer", new LocalStrategy({
    usernameField: 'username', // username and password below is from the html form
    passwordField: 'password'
  }, async function(usernameOrEmailOrAccountNumber, passworded, done) {
    //usernameOrEmail, passworded are input entered into the form field
    // console.log(usernameOrHash, hash);
try {
    const customer = await Customer.findOne({
      $or: [
        {input_email: usernameOrEmailOrAccountNumber},
        {account_number: usernameOrEmailOrAccountNumber},
        {input_username: usernameOrEmailOrAccountNumber}
      ]}).exec();

      console.log(customer);

      if (!customer) {
        return done(null, false, {
          message: 'No user has the email'
        });
      }

      customer.checkedPassword(passworded, function(err, isMatch) {

        if (err) {
          return done(err);
        }

        if (isMatch) {
          return done(null, customer);
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
