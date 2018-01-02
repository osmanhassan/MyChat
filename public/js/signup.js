
$('document').ready(function(){

	$('#password').keyup(function(event){

		var password = $(this).val();

		var passwordError = "";
		
		if( !password.match('[A-Z]+') ){
        	passwordError += "Passord must contain atleast one uppe case<br>";
    	}

		if( !password.match('[a-z]+') ){
        	passwordError += "Passord must contain atleast one lower case<br>";
    	}

		if( !password.match('[0-9]+') ){
        	passwordError += "Passord must contain atleast one number<br>";
    	}

		if( !password.match('[\\W]+') ){
        	passwordError += "Passord must contain atleast one special character<br>";
    	}

    	if( password.length < 6){
        	passwordError += "Password must contain atleast 6 characters<br>";
    	}
    	
    	$('#passwordError').html(passwordError);

	});

	$('#confirmPass').keyup(function(){

		var confirmPassError = '';

		var password = $('#password').val();
		var confirmPass = $('#confirmPass').val();

		if(confirmPass !== password)
			confirmPassError = "Confirm Password must match with Password";

		$('#confirmPassError').html(confirmPassError);
	});

	$('#userName').keyup(function(){

		var userName = $( this ).val();
		$.post('/signup/seachusername', {name: userName}, function(response) {
		    $('#userNameError').html(response);
		});
	});
});
