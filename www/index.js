var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var param = require('../.env/config');


/* This part has to be add before the table name 
can show in the database */
var Admin = require('../models/admin')
var Customer = require('../models/customer')
var transactionType = require('../models/transaction_type')
var loanType = require('../models/loan_type')
var accountType = require('../models/account_type')
var LoanApplication = require('../models/loan_application')


var customerPassport = require('../customerpassport');
var setUpPassport = require('../setuppassport');
const { log } = require('console');

var app = express();


mongoose.connect(param.DATABASECONNECTION);
const db = mongoose.connection;
db.once('open', function() {
  console.log('DB connected')
})
db.on("error", console.error.bind(console, "MongoDB connection error:"));

customerPassport();
setUpPassport();


/////SET
app.set("port", process.env.PORT || 3000);
app.set('view engine', 'ejs');
// console.log(path.join(__dirname,"..","www"));
app.use(express.static(path.join(__dirname, "..", "www")));
// console.log(path.join(__dirname,"..","views"));
app.set("views", path.join(__dirname, "..", "views"))

//////USE
app.use(cookieParser());

app.use(session({
  secret: "iufdghjkiuyt3rde4rt",
  resave: false,
  saveUninitialized: false
}));
app.use(express.urlencoded({
  extended: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use("/", require("../routes/admin"));
app.use("/", require("../routes/customer"));


app.listen(app.get('port'), function() {
  console.log("Server Started at port " + app.get("port"))
});