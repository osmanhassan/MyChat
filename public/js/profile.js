$('document').ready(function(){
	
	var activity = $('#activity').val();
	if(activity === 'offline')
		$("#offline").prop("checked", true);
	else
		$("#online").prop("checked", true);

	$('.mybtn').eq(1).css({'color':'green'});

	$('.pic').each(function(index, element){

		$(element).change(function(){
			
			var formdata = new FormData();
			
			formdata.append("pic", element.files[0]);

			var u = '/ajax/image';
			
			req = new XMLHttpRequest();
	
			req.open("POST", u, true);
			req.send(formdata);
			req.onreadystatechange = function(){
				
				if(req.readyState == 4){
					//alert(req.responseText);
					if(req.responseText !== '')
						$('#img').attr("src",req.responseText);
					
				}
			}
			
		});

	});

	$('input:radio').change(function(){
		var activity = 
		$("input[type='radio']:checked").val();
		
		var data = {activity};
		//alert("Value of Changed Radio is : " + rating);

		$.post('/ajax/changeactivity', data, function(response){

			alert(response);
		});

	});
});
