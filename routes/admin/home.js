var express = require('express');
var passport = require('passport');
const ejs = require('ejs');


var Admin = require("../../models/admin")
var Customer = require("../../models/customer")
var LoanType = require("../../models/loan_type");
const AccountType = require('../../models/account_type');
const accountType = require('../../models/account_type');

var router = express.Router();


router.get('/account/login', function (req, res) {
    var messages = req.flash("error");
    var success = req.flash("success");
    res.render("_admin/auth/login", { success })
})

router.post('/account/login', passport.authenticate('local', {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/account/login",
    failureFlash: true
}))

router.get('/account/register', function (req, res) {
    res.render('_admin/auth/signup')
})

router.post('/account/register', function (req, res, next) {
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var username = req.body.username;
    var phoneNumber = req.body.phone_number;
    var email = req.body.email;
    var password = req.body.password;
    var comfirm_password = req.body.c_password;

    var errorEmail, errorPhone, errorUsername;

    if (password !== comfirm_password) {
        req.flash("errorPassword", "Password Mismatch");
    }

    Admin.findOne({
        $or: [
            { input_username: username },
            { input_email: email },
            { input_phone_number: phoneNumber },
        ]
    }, function (err, admin) {
        if (err) {
            return next(err)
        }
        if (admin) {
            if (admin.input_emaill === email) {
                req.flash("errorEmail", "Email Already Exist");
            } else if (admin.input_username === username) {
                req.flash("errorUsername", "Usename Already Exist")
            } else if (admin.input_phone_number === phoneNumber) {
                req.flash("errorPhoneNumber", "Phone Number Already Exist")
            }
            return res.redirect("/admin/account/register")
        }

        var newAdmin = new Admin({
            input_first_name: firstName,
            input_last_name: lastName,
            input_username: username,
            input_email: email,
            input_phone_number: phoneNumber,
            hash: password,
        })
        newAdmin.save(next);

        req.flash("success", "Registration Successful, Check your mail to verify your account");
        res.redirect("/");

    })
});

// , passport.authenticate('local', {
//     failureRedirect : "/admin/account/register",
//     failureFlash:true
// })

router.get('/dashboard', function (req, res) {
    res.render("_admin/dashboard")
})

router.get('/view/customers', function (req, res) {
    res.render('_admin/customer/view_customer')
})

router.get('/edit/customer/:id', function (req, res) {
    hashId = req.params.id;
    console.log(hashId);
    Customer.findById(hashId).exec(function (err, fetchCustomer) {
        console.log(fetchCustomer);
        res.render("_admin/customer/edit", { customerValues: fetchCustomer })
    })
})



router.post('/edit/customer/:id', function (req, res, next) {
    var id = req.params.id;

    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var username = req.body.username;
    var accountType = req.body.account_type;

    Customer.updateMany(
        { _id: id },
        {
            $set:
            {
                input_first_name: firstName,
                input_last_name: lastName,
                username: username,
                account_type_name: accountType
            }
        }, { new: true },
        function (err, newCustomer) {
            if (err) {
                return next(err)
            }
            req.flash("message", "Profile Updated Successful");
            res.redirect("/admin/edit/customer/"+id);
        })
})

router.get('/add/loan/type', function (req, res) {
    res.render("_admin/loan_type/all_loan_type")
})

router.post('/add/loan/type', function (req, res, next) {
    var inputName = req.body.input_name;


    LoanType.findOne({
        input_name: inputName
    }, function (err, loan_type) {

        if (err) {
            return next(err)
        }
        if (loan_type) {
            req.flash("error", "Loan Type Already Exist");
            return res.redirect("/admin/add/loan/type")
        }
        var newLoanType = new LoanType({
            input_name: inputName,
        })
        //  console.log(newLoanType);
        //  process.exit();

        newLoanType.save(next);
        req.flash("success", "Loan Type Added Succesfully");
        return res.redirect("/admin/add/loan/type")
    })
})

router.get('/edit/loan/:id', function (req, res) {
    const hashId = req.params.id;
    LoanType.findById(hashId).exec(function (err, loanTypeVal) {
        res.render('_admin/loan_type/edit_loan_type', { loanTypeValue: loanTypeVal })
    })
})

router.post('/edit/loan/:id', function (req, res, next) {
    var hashId = req.params.id;
    var inputName = req.body.input_name;
    LoanType.findOne({
        input_name: inputName
    }, function (err, loanTypeName) {

        if (err) {
            return next(err);
        }
        if (loanTypeName) {
            req.flash('error', "Loan Type already exist")
            return res.redirect('/admin/edit/loan/' + hashId)
        }

        LoanType.updateOne(
            { _id: hashId },
            { input_name: inputName },
            { new: true },
            function (err, updateLoanType) {
                console.log(updateLoanType);
                if (err) {
                    return next(err)
                }
                req.flash("success", "Loan Type Updated Successful");
                res.redirect('/admin/edit/loan/' + hashId);
            })

    })
})

router.get('/add/account/type', function (req, res) {
    res.render('_admin/account_type/add')
})

router.post('/add/account/type', function (req, res, next) {
    var accountName = req.body.account_name;
    var minimumOpeningBalance = req.body.min_open_bal;
    var maximumOpeningBalance = req.body.max_open_bal;
    var minimumBalance = req.body.min_bal;
    var maximumBalance = req.body.max_bal;

    AccountType.findOne({
        account_name: accountName
    }, function (err, accountTypeInfo) {
        if (err) {
            return next(err)
        }
        if (accountTypeInfo) {
            req.flash('error', "Account Type Already Exist")
            return res.redirect('/admin/add/account/type')
        }

        var newAccountType = new AccountType({
            account_name: accountName,
            minimum_opening_balance: minimumOpeningBalance,
            maximum_opening_balance: maximumOpeningBalance,
            expected_minimum_balance: minimumBalance,
            expected_maximum_balance: maximumBalance,
        })
        newAccountType.save(next);
        req.flash("success", "Account Type Created Succesfully");
        res.redirect("/admin/add/account/type");

    })
})

router.get('/manage/account/type', function (req, res) {
    res.render('_admin/account_type/manage')
})

module.exports = router;