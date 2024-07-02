var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Admin = require("./models/admin");
var Customer = require("./models/customer")



module.exports = () => {

//entity could be the user, admin
//id and type is assigned  as object to 'entity' of each

// then deserializing has the entity as the object

  passport.serializeUser((entity, done) => {

    // console.log(entity) 
    done(null, {id:entity._id, type: entity.type } )
  });

  passport.deserializeUser(async (object, done) => {
    // console.log(object);
    try {
      if (object.type == 'admin') {
        const admin = await Admin.findById(object.id).exec();
      done(null, admin);
      } else {
        const customer = await Customer.findById(object.id);
        done(null, customer);
      }
      
    } catch (err) {
      done(err)
    }
  })

  passport.use("local", new LocalStrategy({
    usernameField: 'input_email',
    passwordField: 'hash'
  }, async function (input_email, hash, done) {
    try {
      const admin = await Admin.findOne({ input_email: input_email }).exec();
      if (!admin) {
        return done(null, false, {
          message: 'No user has the email'
        });
      }
      admin.checkAdminPassword(hash, function (err, isMatch) {

        if (err) {
          return done(err);
        }

        if (isMatch) {
          return done(null, { ...admin.toObject(), type: 'admin'});
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

      // console.log(customer);

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
          return done(null, {...customer.toObject(), type: 'customer'});
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
