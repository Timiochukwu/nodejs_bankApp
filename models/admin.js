var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

const SALT_FACTOR = 10;
const Schema = mongoose.Schema;

var adminSchema = new Schema({
    input_first_name : {type:String, required:true, maxLength:100},
    input_last_name : {type:String, required:true, maxLength:100},
    input_username : {type:String, unique:true, required:true, maxLength:20},
    input_email : {type:String, unique:true, required:true, maxLength:200},
    input_phone_number : {type:String, unique:true, required:true, maxLength:20},
    hash               : {type:String, unique:true, required:false, maxLength:225},
    time_created :  {type:String},
    date_created :  {type:String}
});

/// "pre" means before it going to be saved

 
adminSchema.pre('save', function (done) {
    var admin = this;
    // console.log(admin, done, "I GOT HERE");

    if (!admin.isModified('hash')) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, (err, salt)=>{
        if (err) {
            return done(err);
        }
    bcrypt.hash(admin.hash, salt, function(err, hashedPassword) {
        if (err) {
            return done(err)
        }
        admin.hash = hashedPassword;
        done();
        });
    });

});

adminSchema.methods.checkAdminPassword = function(guess, done){
    if(this.hash != null){
        bcrypt.compare(guess,this.hash, function(err, isMatch){
           done(err, isMatch);
        });
    }
}

const adminTable = mongoose.model('admin', adminSchema)

module.exports = adminTable;