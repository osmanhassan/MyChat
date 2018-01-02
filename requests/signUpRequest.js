var inputValidator = require('node-input-validator');
var deasync = require('deasync');
var user = require('../models/user');

inputValidator.extend('hasUpper', async function (field, value) {
	 
	    if( value.match('[A-Z]+')){
	        return true;
	    }

	    return false;
	 
	});
inputValidator.extend('hasLower', async function (field, value) {
	 
	    if( value.match('[a-z]+')){
	        return true;
	    }

	    return false;
	 
	});
inputValidator.extend('hasSpecial', async function (field, value) {
	 
	    if( value.match("[\\W]+")){
	        return true;
	    }

	    return false;
	 
	});
inputValidator.extend('hasNumber', async function (field, value) {
	 
	    if( value.match("[0-9]+")){
	        return true;
	    }

	    return false;
	 
	});

inputValidator.extend('uniqueUser', async function (field, value) {
	 	
		var s = null;
	   user.findByName(value, function(result){
	    	if(result.length == 0)
	    		s = true;
		    else 
		    	s = false;
		    
		    
	    }); 
	
	   while((s == null)){
	   		deasync.runLoopOnce();
	   }
	    return s;
	 
	});

inputValidator.messages({
    hasUpper: 'The :attribute field must contain atleast one upper Case.',
    hasLower: 'The :attribute field must contain atleast one lower Case.',
    hasSpecial: 'The :attribute field must contain atleast one special character.',
    hasNumber: 'The :attribute field must contain atleast one number.',
    uniqueUser: 'The :attribute is already taken try another.'
});
function validate(body, callback){

	var values = {
		userName: body.userName,
		password: body.password,
		confirmPass: body.confirmPass
	};

	var rules = {
		userName: 'required|maxLength:20|uniqueUser',
		password: 'required|minLength:6|maxLength:12|hasUpper|hasLower|hasSpecial|hasNumber',
		confirmPass: 'required|same:password'
	};
	
	var r = {};
	validator = new inputValidator(r, values, rules);

	const userName = body.userName;

	validator.check().then(function (matched) {
		var data;
	    if(matched){
	    	data = {
	    		status: matched,
	    		userName: userName,
	    		userNameError: '',
	    		passwordError: '',
	    		confirmPassError: ''
	    	};
	    	
	    }

	    else{

	    	if(validator.errors.hasOwnProperty("userName")){
			   var userNameError = validator.errors.userName.message;
			}else{
			   var userNameError = '';
			}

	    	if(validator.errors.hasOwnProperty("password")){
			   var passwordError = validator.errors.password.message;
			}else{
			   var passwordError = '';
			}

	    	if(validator.errors.hasOwnProperty("confirmPass")){
			   var confirmPassError = validator.errors.confirmPass.message;
			}else{
			   var confirmPassError = '';
			}

	    	data = {
	    		status: matched,
	    		userName: userName,
	    		userNameError: userNameError,
	    		passwordError: passwordError,
	    		confirmPassError: confirmPassError
	    	};
	    	
	    	//response.render('signUp',data);
	    }
	    callback(data);
	    //console.log(validator.errors);
	});

}

module.exports = {validate};