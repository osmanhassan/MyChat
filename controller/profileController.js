var express = require('express');
var user = require('../models/user');

var router = express.Router();

router.get('/', function(request, response){
	var data = request.session.user;
	response.render('users/profile', data);
});



module.exports = router;