var mongoose = require('mongoose');


const Schema = mongoose.Schema
transactionTypeSchema = new Schema({
    transaction_id : {type:String, require:true},
    customer_id : {type:String, require:true},
    sender_id : {type:String, require:true},
    transaction_type : {type:String, require:true},
    transaction_amount : {type:String, require:true},
    previous_balance : {type:String, require:true},
    final_balance : {type:String, require:true},
    visibility : {type:Number, enum:[0, 1], default: 1, require:true},
    date_created: { type: Date, default: Date.now }
})

var transactionType = mongoose.model('transaction_type', transactionTypeSchema);
module.exports = transactionType;