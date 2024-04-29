var express = require('express')


var router = express.Router();

router.get('/home',(req, res)=>{
res.json("This is a Json to get request from user from API ")
})


module.exports = router;
