var express = require('express');
var router = express.Router();

var Customer = require("../../models/customer");
var Admin = require("../../models/admin");
var LoanType = require("../../models/loan_type");
var AccountType = require("../../models/account_type");

router.use(function (req, res, next) {
    res.locals.currentAdmin = req.user;
    res.locals.errorEmail = req.flash('errorEmail');
    res.locals.errorUsername = req.flash('errorUsername');
    res.locals.errorPhoneNumber = req.flash('errorPhoneNumber');
    res.locals.errorPassword = req.flash('errorPassword');
    res.locals.successMessage = req.flash("success");
    res.locals.errorMessage = req.flash("error");
    res.locals.info = req.flash("info");

    res.locals.host = req.headers.host;
    next();
});

// Middleware to fetch customers and store them in res.locals
router.use(async (req, res, next) => {
    try {
        const customerValue = await Customer.find({}).exec();
        res.locals.Customer = customerValue; // Store customer data in res.locals
        next(); // Continue to the next middleware
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});



// Middleware to fetch account types and match them with customers
router.use(async (req, res, next) => {
    try {
        const customerList = res.locals.Customer; // Retrieve stored customers
        const accountTypes = await AccountType.find({}).exec();

        // Create a map to easily match account types by ID
        const accountTypeMap = new Map();
        accountTypes.forEach((type) => {
            accountTypeMap.set(type._id.toString(), type.account_name);
        });

        // Attach account names to customers
        const updatedCustomers = customerList.map((customer) => {
            const accountTypeId = customer.account_type_name;
            const accountName = accountTypeMap.get(accountTypeId);
            return {
                ...customer.toObject(), // Convert Mongoose document to plain object
                account_name: accountName || 'Unknown', // Default to 'Unknown' if not found
            };
        });

        res.locals.Customer = updatedCustomers; // Store updated customers in res.locals
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching account types');
    }
});

router.use(async (req, res, next) => {
    try {
        const loanTypeValues = await LoanType.find({}).exec();
        res.locals.LoanTypes = loanTypeValues;
        next();
    } catch (err) {
        next(err);
    }
});

router.use(async (req, res, next) => {
    try {
        const fetchAccountType = await AccountType.find({}).exec();
        res.locals.AccountTy = fetchAccountType;
        next();
    } catch (err) {
        next(err);
    }
});

router.use('/admin', require('./home'));
module.exports = router;
