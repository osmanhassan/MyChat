var express = require('express');
var signUpRequest = require('../requests/signUpRequest');
var user = require('../models/user');
var router = express.Router();



router.get('/', function(request, response){
	data = {

	    		userName: '',
	    		userNameError: '',
	    		passwordError: '',
	    		confirmPassError: ''
	    	}
	response.render('signUp', data);
});

router.post('/', function(request, response){
	//console.log(request.body);
	var values= {
		userName: request.body.userName,
		password: request.body.password,
		confirmPass: request.body.confirmPass,
		image: '/images/defaultuser.png',
		activity: 'offline'
	}
	signUpRequest.validate(values,function(data){
		if(data.status){
			user.insert(values,function(status){
				if(status){
					response.redirect('/');
				}
				else
					response.render('signUp', data);
			});
		}
		else
			response.render('signUp', data);
	});
	
});

router.post('/seachusername', function(request, response){
	var userName = request.body.name;
	user.findByName(userName, function(result){
    	if(result.length == 0)
    		response.send("");
	    else 
	    	response.send(userName + " is already taken try with another one.");	    
	}); 
});

module.exports = router;