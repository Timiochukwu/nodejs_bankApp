var express = require('express');
const Customer = require('../../models/customer');
var transactionType = require('../../models/transaction_type')

const passport = require('passport');

var router = express.Router();

router.get('/auth/signin', function (req, res) {
    res.render("_customer/auth/signin")
})

router.post('/auth/signin', passport.authenticate("localCustomer", {
    successRedirect: "/customer/dashboard",
    failureRedirect: "/customer/auth/signin",
    failureFlash: true
}))

router.get('/auth/signup', function (req, res) {
    res.render("_customer/auth/signup")
})


router.post('/auth/signup', function (req, res, next) {
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var username = req.body.username;
    var email = req.body.email;
    var phoneNumber = req.body.phone_number;
    var hashed = req.body.password;


    var Error = [];

    Customer.findOne({
        $or: [
            { input_email: email },
            { input_username: username },
        ]
    }, function (err, customer) {
        if (err) {
            return next(err)
        }
        if (customer) {
            if (customer.input_email === email) {
                req.flash("errorEmail", "Email Already Exist");
            } else if (customer.input_username === username) {
                req.flash("errorEmail", "Email Already Exist")
            }
            return res.redirect("/auth/signup")
        }
        var newCustomer = new Customer({
            input_first_name: firstName,
            input_last_name: lastName,
            input_username: username,
            input_email: email,
            input_phone_number: phoneNumber,
            hash: hashed,
        })

        // console.log(newCustomer);
        // process.exit();
        newCustomer.save(next);

        req.flash("success", "Registration Successful, Check your mail to verify your account");
        res.redirect("/customer/auth/signin");
    })

})

router.get("/dashboard", function (req, res) {
    res.render("_customer/dashboard")
})

router.get('/send/money', function (req, res) {
    res.render("_customer/send_money")
})

router.post('/send/money', function (req, res, next) {

    var currentUser = req.user;


    var accountNumber = req.body.acc_num;
    var amount = parseInt(req.body.amount);
    var transactionId = generateTransactionId();



    // process.exit();

    if (currentUser.account_number === accountNumber) {
        req.flash("errorMessage", "You cannot transfer money to your own account");
        return res.redirect("/customer/send/money");
    }
    if (currentUser.account_balance < amount) {
        req.flash("errorMessage", "You have insufficient balance");
        return res.redirect("/customer/send/money");
    }



    Customer.findOne({
        account_number: accountNumber,
    }, function (err, recipient) {
        if (err) {
            return next(err)
        }
        if (!recipient) {
            req.flash("errorMessage", "Account Number does not exist");
            return res.redirect("/customer/send/money");
        }

        // Calculate final for sender and recipient
        var senderFinalBalance = currentUser.account_balance - amount;
        var recipientFinalBalance = recipient.account_balance + amount;

        var senderTransaction = new transactionType({
            transaction_id: transactionId,
            recipient_id: currentUser._id,
            sender_id: recipient._id,
            transaction_type: "DEBIT",
            transaction_amount: amount,
            previous_balance: currentUser.account_balance,
            final_balance: senderFinalBalance,
        });

        var recipientTransaction = new transactionType({
            transaction_id: transactionId,
            recipient_id: recipient._id,
            sender_id: currentUser._id,
            transaction_type: "CREDIT",
            transaction_amount: parseInt(amount),
            previous_balance: recipient.account_balance,
            final_balance: recipientFinalBalance,
        })

        // Save sender transaction
        senderTransaction.save(function (err) {
            if (err) {
                return next(err);
            }
            // Save recipient transaction
            recipientTransaction.save(function (err) {
                if (err) {
                    return next(err);
                }

                // update sender's account balance
                Customer.updateOne(
                    { _id: currentUser._id },
                    { $inc: { account_balance: -amount } },
                    function (err) {
                        if (err) {
                            return next(err);

                        }
                        // Proceed with updating sender's account balance
                        Customer.updateOne(
                            { _id: recipient._id },
                            { $inc: { account_balance: amount } },
                            function (err) {
                                if (err) {
                                    return next(err);
                                }
                            }
                        )
                        // console.log(senderFinalBalance, recipientFinalBalance)

                        req.flash("success", "Transaction Successful");
                        res.redirect("/customer/send/money");

                    });
            });
        });
    });

});





function generateTransactionId() {
    const min = 1000000;
    const max = 9999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;

}

router.get('/profile', function (req, res) {
    res.render('_customer/profile')
})

router.post('/profile', function (req, res, next) {
    currentUser = req.user;
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var username = req.body.username;
    var phoneNumber = req.body.number;


    Customer.updateMany(
        { _id: currentUser._id },
        {
            $set: {
                input_first_name: firstName,
                input_last_name: lastName,
                input_username: username,
                input_phone_number: phoneNumber,
            }

        },
        {new : true},
         function (err, updates) {
            // console.log(updates);
            if (err) {
                return next(err)
            }
            req.flash("message", "Profile Updated Successful");
            res.redirect("/customer/profile/");
        })
})

module.exports = router;