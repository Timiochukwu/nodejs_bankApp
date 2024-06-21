// var express = require('express');
// var router = express.Router();


// var Customer = require("../../models/customer")
// var LoanType = require("../../models/loan_type")
// var AccountType = require("../../models/account_type");



// router.use(function (req, res, next) {

//     res.locals.errorEmail = req.flash('errorEmail');
//     res.locals.errorUsername = req.flash('errorUsername');
//     res.locals.errorPhoneNumber = req.flash('errorPhoneNumber');
//     res.locals.errorPassword = req.flash('errorPassword');
//     res.locals.successMessage = req.flash("success");
//     res.locals.errorMessage = req.flash("error");
//     res.locals.info = req.flash("info");

//     res.locals.host = req.headers.host;

//     // console.log(res.locals);
//     next();
// });


// // Middleware to fetch customers and store them in res.locals
// router.use((req, res, next) => {
//     Customer.find({}).exec((err, customerValue) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send('Server Error');
//         }

//         res.locals.Customer = customerValue; // Store customer data in res.locals
//         next(); // Continue to the next middleware
//     });
// });

// // Middleware to fetch account types and match them with customers
// router.use((req, res, next) => {
//     const customerList = res.locals.Customer; // Retrieve stored customers

//     AccountType.find({}).exec((err, accountTypes) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send('Error fetching account types');
//         }

//         // Create a map to easily match account types by ID
//         const accountTypeMap = new Map();
        
//         accountTypes.forEach((type) => {
//             // console.log(type._id.toString());
//             accountTypeMap.set(type._id.toString(), type.account_name);
//             // accountTypeMap.set(type.maximum_opening_balance, type.minimum_opening_balance);
//             // console.log(accountTypeMap);
//         });

//         // Attach account names to customers
//         const updatedCustomers = customerList.map((customer) => {
//             const accountTypeId = customer.account_type_name;
//             const accountName = accountTypeMap.get(accountTypeId);
           
            

//             return {
//                 ...customer.toObject(), // Convert Mongoose document to plain object
//                 account_name: accountName || 'Unknown', // Default to 'Unknown' if not found
                
//             };
            
            
//         });

//         res.locals.Customer = updatedCustomers; // Store updated customers in res.locals
//         // console.log(updatedCustomers);
//         next(); // Continue to the next middleware or route handler
//     });
// });




// router.use(function(req, res, next) {
//     LoanType.find({}).exec(function(err, loanTypeValues) {
//         if (err) {
//             return next(err);
//         }
//         // The LoanTypes below is the one that will be passses in the frontend to 
//         // forEach
//         res.locals.LoanTypes = loanTypeValues;
        
//         next();
        
//     })
// })

// router.use(function(req, res, next) {
//     AccountType.find({}).exec(function(err, fetchAccountType) {
//         if (err) {
//             return next(err)
//         }
//         res.locals.AccountTy = fetchAccountType;
//         next();
//     })
// })




// router.use('/admin', require('./home'))
// module.exports = router;


var express = require('express');
var router = express.Router();

var Customer = require("../../models/customer");
var LoanType = require("../../models/loan_type");
var AccountType = require("../../models/account_type");

router.use(function (req, res, next) {
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
