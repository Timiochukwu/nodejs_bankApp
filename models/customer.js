var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

const SALT_FACTOR = 10;
const Schema = mongoose.Schema;

var customerSchema = new Schema({
    input_first_name: { type: String, required: true, maxLength: 100 },
    input_last_name: { type: String, required: true, maxLength: 100 },
    input_username: { type: String, required: true, unique: true, maxLength: 100 },
    input_email: { type: String, required: true, unique: true, maxLength: 100 },
    input_phone_number: { type: String, required: true, maxLength: 100 },
    account_type_name: { type: String, default: null },
    account_number: { type: String, required: false, unique: true, maxLength: 10 },
    account_balance: { type: Number, unique:false, default:false },
    status: { type: Number, enum: [0, 1], default: 0 },
    visibility: { type: Number, enum: [0, 1], default: 1 },
    hash: { type: String, required: false, maxLength: 225 },
    date_created: { type: Date, default: Date.now }
})


///// This encrypt password before it is save to the database
customerSchema.pre("save", function (done) {
    var customer = this;
    const min = 1000000;
    const max = 9999999;

    const accountBalance = Math.floor(Math.random() * (max - min + 1)) + min;
    this.account_number = "310" + accountBalance.toString();
    this.account_balance = 4000;

    if (!customer.isModified("hash")) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {

        if (err) { return done(err); }
        bcrypt.hash(customer.hash, salt, function (err, hashedPassword) {

            if (err) { return done(err); }
            customer.hash = hashedPassword;

            done();
        });
    });
});
///// End of Encrypting password


//To validate whether password match
customerSchema.methods.checkedPassword = function (guess, done) {
    if (this.hash != null) {
        bcrypt.compare(guess, this.hash, function (err, isMatch) {
            done(err, isMatch);
        });
    }
}


var Customer = mongoose.model('customers', customerSchema);
module.exports = Customer;

