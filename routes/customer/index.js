var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errorEmail = req.flash('errorEmail');
    res.locals.errorUsername = req.flash('errorUsername');
    res.locals.errorPhoneNumber = req.flash('errorPhoneNumber');
    res.locals.errorPassword = req.flash('errorPassword');
    res.locals.successMessage = req.flash('message');
    res.locals.errorMessage = req.flash("errorMessage");

    res.locals.host = req.headers.host;

    next();
})



router.use("/customer", require("./home"))
module.exports = router;