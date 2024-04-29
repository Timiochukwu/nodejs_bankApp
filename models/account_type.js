var mongoose = require('mongoose');

var DBSchema = mongoose.Schema;

var accountTypeSchema = new DBSchema({
    account_name : { type: String, required:true, unique:true, maxLength: 20},
    minimum_opening_balance : { type: Number},
    maximum_opening_balance : { type: Number},
    expected_minimum_balance : { type: Number},
    expected_maximum_balance : { type: Number},
    visibility: {type:Number, enum: [0, 1], default:1},
    date: {type:Date, dafault:Date.now}
})

var accountType = mongoose.model('account_type', accountTypeSchema);
module.exports = accountType;