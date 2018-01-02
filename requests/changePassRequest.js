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



inputValidator.messages({
    hasUpper: 'The :attribute field must contain atleast one upper Case.',
    hasLower: 'The :attribute field must contain atleast one lower Case.',
    hasSpecial: 'The :attribute field must contain atleast one special character.',
    hasNumber: 'The :attribute field must contain atleast one number.'
   
});

function validate(body, callback){

	var values = {
		PreviousPassword: body.PreviousPassword,
		ConfirmNewPassword: body.ConfirmNewPassword,
		NewPassword: body.NewPassword,
		password: body.password,
	};

	var rules = {
		ConfirmNewPassword: 'required|same:NewPassword',
		NewPassword: 'required|minLength:6|maxLength:12|hasUpper|hasLower|hasSpecial|hasNumber',
		PreviousPassword: 'required|same:password'
	};
	
	var r = {};
	validator = new inputValidator(r, values, rules);

	validator.check().then(function (matched) {
		var data;
	    if(matched){
	    	data = {
	    		status: matched,
	    		ConfirmNewPasswordError: '',
	    		NewPasswordError: '',
	    		PreviousPasswordError: ''
	    	};
	    	
	    }

	    else{

	    	if(validator.errors.hasOwnProperty("ConfirmNewPassword")){
			   var ConfirmNewPasswordError = validator.errors.ConfirmNewPassword.message;
			}
			else{
			   var ConfirmNewPasswordError = '';
			}

	    	if(validator.errors.hasOwnProperty("PreviousPassword")){
			   var PreviousPasswordError = validator.errors.PreviousPassword.message;
			}
			else{
			   var PreviousPasswordError = '';
			}

	    	if(validator.errors.hasOwnProperty("NewPassword")){
			   var NewPasswordError = validator.errors.NewPassword.message;
			}
			else{
			   var NewPasswordError = '';
			}

	    	data = {
	    		status: matched,
	    		NewPasswordError: NewPasswordError,
	    		PreviousPasswordError: PreviousPasswordError,
	    		ConfirmNewPasswordError: ConfirmNewPasswordError
	    	};
	    	
	    	//response.render('signUp',data);
	    }
	    callback(data);
	    //console.log(validator.errors);
	});

}

module.exports = {validate};