$('document').ready(function(){

	$('.mybtn').eq(4).css({'color': 'green'});
	$('.card-footer .mybtn').each(function(index, element){

		$(element).click(function(){

			if($(this).val() !== 'PENDING'){
				var rid = $(this).attr('id');

				var data = {rid: rid};

				rid = '#' + rid;
				$.post('/ajax/sendrequest', data, function(response){
					$(rid).val(response);
				});
			}

		});

	});
});
