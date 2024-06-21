var mongoose = require('mongoose');


const Schema = mongoose.Schema
LoanApplicationSchema = new Schema({
    transaction_id : {type:String, require:true},
    customer_hash_id : {type:String, require:true},
    amount : {type:String, require:true},
    bank : {type:String, require:true},
    account_number : {type:String, require:true},
    loan_type_id : {type:String, require:true},
    installment_count : {type:String, require:true},
    installment_amount : {type:String, require:true},
    amount_payable : {type:String, require:true},
    date_applied: { type: Date, default: Date.now },
    status : {type:String, enum:['approved', 'unapproved'], default:'unapproved', require:true},
    visibility : {type:Number, enum:[0, 1], default: 1, require:true},
    date_created: { type: Date, default: Date.now }
})

var LoanApplication = mongoose.model('loan_application', LoanApplicationSchema);
module.exports = LoanApplication;