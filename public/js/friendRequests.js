$('document').ready(function(){

	$('.mybtn').eq(2).css({'color': 'green'});

	$('.card .mybtn').each(function(index, element){

		$(element).click(function(){

			var id = $(this).attr('id');

			var status = id.split('/');

			var uid = status[1];

			status = status[0];

			if(status === 'c')
				status = 'cancelled';
			else
				status = 'accepted';

			var data ={
						uid: uid,
						status: status
					};
			
			var hide = '#b' + uid ;

			$.post('/ajax/changestatus', data, function(response){
				
				$(hide).hide(3000);

			});

		});

	});

});