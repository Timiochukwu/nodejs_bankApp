var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var loanTypeSchema = new Schema ({
    input_name : {type: String, unique:true, required: true, maxLength: 20},
    visibility: { type: Number, enum: [0, 1], default: 1 },
    date:       {type:Date, default:Date.now }
})

var loanType = mongoose.model('loan_type', loanTypeSchema);
module.exports = loanType;