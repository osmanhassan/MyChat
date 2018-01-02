var express = require('express');
var user = require('../models/user');
var changePassRequest = require('../requests/changePassRequest');

var router = express.Router();

router.get('/', function(request, response){
	var data = {

	    		ConfirmNewPasswordError: '',
	    		NewPasswordError: '',
	    		PreviousPasswordError: '',
	    		confirmation: ''
	    	};
	response.render('users/changepass', data);
});

router.post('/', function(request, response){
	var values= {
		password: request.session.user.password,
		ConfirmNewPassword: request.body.ConfirmNewPassword,
		NewPassword: request.body.NewPassword,
		PreviousPassword: request.body.PreviousPassword
	}
	changePassRequest.validate(values,function(data){
		if(data.status){
			request.session.user.password = values.NewPassword;

			var params= request.session.user;
			
			user.updateUser(params, function(status){
				if(status){
					data.confirmation = 'Password changed successfully.';
					response.render('users/changepass', data);
				}
				else{
					data.confirmation = '';
					response.render('users/changepass', data);
				}
			});
		}
		else{
			data.confirmation = '';
			response.render('users/changepass', data);
		}
	});
});

module.exports = router;