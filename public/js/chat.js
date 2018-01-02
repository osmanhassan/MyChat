function giveChat(){
	$.post('/ajax/chat',{},function(response){
		$('#myDiv').html(response);
	});
}
$('document').ready(function(){
	$('.mybtn').eq(0).css({'color': 'green'});
	setInterval(giveChat,3000);
});