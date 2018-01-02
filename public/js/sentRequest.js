$('document').ready(function(){
	$('.mybtn').eq(2).css({'color': 'green'});

	$('.card-footer.chat-body .mybtn').each(function(index, element){
		$(element).click(function(){
			var uid = $(this).attr('id');

			status = 'cancelled';
			
			var data ={
						uid: uid,
						status: status,
						myRequest : 1
					};
			
			var hide = '#b' + uid ;

			$.post('/ajax/changestatus', data, function(response){
				
				$(hide).hide(3000);

			});

		});
		
	});
});