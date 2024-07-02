var express = require('express');
var router = express.Router();

const LoanType = require('../../models/loan_type');
const LoanApplication = require('../../models/loan_application');
const Customer = require('../../models/customer');
const { log } = require('async');

router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errorEmail = req.flash('errorEmail');
    res.locals.errorUsername = req.flash('errorUsername');
    res.locals.errorPhoneNumber = req.flash('errorPhoneNumber');
    res.locals.errorPassword = req.flash('errorPassword');
    res.locals.successMessage = req.flash('successMessage');
    res.locals.errorMessage = req.flash("errorMessage");

    res.locals.host = req.headers.host;
    next();


})




router.use(async(req, res, next) => {
    try {
        const loanTypeValues = await LoanType.find({}).exec();
        res.locals.LoanTypes = loanTypeValues;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.use(async (req, res, next) => {
    try {
        const loanApplicationValue = await LoanApplication.find({}).exec();
        res.locals.LoanApplication = loanApplicationValue;
        next()
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
        
    }
});

// router.use(async (req, res, next) =>{
//     try {
//         const customerValue = await Customer.find({}).exec();
//         res.locals.Customer = customerValue;
//         console.log(customerValue);
//         next();
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Server Error');
//     }
// })


router.use("/customer", require("./home"))
module.exports = router;