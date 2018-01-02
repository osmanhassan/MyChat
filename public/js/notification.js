
function contUnseenNotification(){
	$.post('/ajax/countunseennotification', {}, function(response){
		if(response !== '0')
			$('.noti').html(response);
		else
			$('.noti').html('');
	});
}

$('document').ready(function(){
	setInterval(contUnseenNotification, 2000);

	$('.noti').click(function(){

		$.post('/ajax/giveNotification', {}, function(response){
			$('#noti-box').html(response);
			$('.noti-box').toggle(2000);
		});

	});

});