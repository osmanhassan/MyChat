$('document').ready(function(){
	
	$('.mybtn').eq(3).css({'color': 'green'});

	$('.card-footer.chat-body .mybtn').each(function(index, element){
		$(element).click(function(){
			var uid = $(this).attr('id');

			status = 'cancelled';
			
			var data ={
						uid: uid,
						status: status,
						
					};
			
			var hide = '#b' + uid ;
				
			$.post('/ajax/unfriend', data, function(response1){
			
				$(hide).hide(3000);

			});	

		});
		
	});
});