$('document').ready(function(){
	

	$('#NewPassword').keyup(function(event){

		var password = $(this).val();

		var passwordError = "";

		if( !password.match('[A-Z]+') ){
        	passwordError += "New Password must contain atleast one uppe case<br>";
    	}

		if( !password.match('[a-z]+') ){
        	passwordError += "New Password must contain atleast one lower case<br>";
    	}

		if( !password.match('[0-9]+') ){
        	passwordError += "New Password must contain atleast one number<br>";
    	}

		if( !password.match('[\\W]+') ){
        	passwordError += "New Password must contain atleast one special character<br>";
    	}

    	if( password.length < 6){
        	passwordError += "New Password must contain atleast 6 characters<br>";
    	}
    	
    	$('#NewPasswordError').html(passwordError);

	});

	$('#ConfirmNewPassword').keyup(function(){

		var confirmPassError = '';

		var password = $('#NewPassword').val();
		var confirmPass = $(this).val();

		if(confirmPass !== password)
			confirmPassError = "Confirm New Password must match with New Password";

		$('#ConfirmNewPasswordError').html(confirmPassError);
	});

	$('#PreviousPassword').keyup(function(){

		var password = $( this ).val();
		$.post('/ajax/checkpass', {password: password}, function(response) {
		    $('#PreviousPasswordError').html(response);
		});
	});
});