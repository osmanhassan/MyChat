var express = require('express');
var user = require('../models/user');
var router = express.Router();

router.get('/', function(request, response){
	
	response.render('login', {userName: '', error: ''});
});

router.post('/', function(request, response){
	
	user.getUserByNamePass(request.body, function(result){
		if(result.length > 0 && result[0].password === request.body.password){
			
			result[0].activity = 'online';
			var data = {
							uid: result[0].uid,
							name: result[0].name,
							password: result[0].password,
							image: result[0].image,
							activity: result[0].activity
						}
			user.updateUser(data, function(status){
				if(status){
					request.session.user = data;
					console.log(result[0].name + ' logged in');
					response.redirect('/profile');
				}
				else{
					console.log(result[0].name + 'could not login for db error.');
				}
			});
			
			
		}
		else{console.log(result);
			response.render('login', {userName: request.body.userName, error:'Invalid username or password'});
		}
	});
});

module.exports = router;