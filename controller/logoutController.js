var express = require('express');
var router = express.Router();
var user = require('../models/user');

router.get('/', function(request, response){

	request.session.user.activity = 'offline';

	var data = request.session.user;
	
	user.updateUser(data, function(status){

		if(status){
			console.log(data.name + ' logged out');
			delete request.session.user;
			response.redirect('/');
		}
		else{
			console.log(data.name + 'could not log out for db error.');
		}
	});
	
});


module.exports = router;