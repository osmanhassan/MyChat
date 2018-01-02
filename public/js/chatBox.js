function updateChatBox(){

	var sender = $('#friendId').val();

	var data = {sender: sender};

	$.post('/ajax/updatechatbox', data, function(response){
		
		if(response !== ''){

			if(response != 'seen'){
				$('#chatBox').html($('#chatBox').html() + response);
				$('#chats').scrollTop($('#chats')[0].scrollHeight - $('#chats')[0].clientHeight);
				$('#seenBox').html('');
				$('#seenBox').hide();
				$('#chatBox').show();
				bindDelete();
			}
			else{
				$('#seenBox').html(response);
				$('#seenBox').show();
				
			}

			
		}
		
	});
}

function bindDelete(){
	$( "span[name*='delete']" ).each(function(index, element){
		$(element).click(function(){
			
			var id = $(this).attr('id');

			var messageBox  = '#mb' + id;

			var data = {
							mid: id
						};

			$.post('/ajax/deletechatbyid', data, function(response){
				if(response === ''){
					$(messageBox).hide(3000);
					$('#seenBox').hide();

				}
			});

		});
	});
}

$('document').ready(function(){

	$('#chats').scrollTop($('#chats')[0].scrollHeight - $('#chats')[0].clientHeight);

	setInterval(updateChatBox,2000);
	bindDelete();

	$('#send_btn').click(function(){

		var message = $('#message').val();

		if(message.match("[\\w]+")){
			
			//
			var receiver = $('#friendId').val();
			var m1 = '';
			var count = 0;

			for(var i = 0; i < message.length; i++){
				
				if(message[i] == ' ' || message[i] == '\n')
					count = 0;
				else
					count++;

				if(count == 20){
					m1 += ' ';
					count = 0;
				}

				m1 += message[i];
			}
			
			message = m1;
			message = message.replace(/^\s+|\s+$/g, '');
			message = message.trim(/^\r\n|\r\n$/g, '');
			
			
			var data ={
						receiver: receiver,
						message: message
					};
			
			$.post('/ajax/sendchat', data, function(response){
				$('#chatBox').html($('#chatBox').html() + response);
				$('#chats').scrollTop($('#chats')[0].scrollHeight - $('#chats')[0].clientHeight);
				$('#message').val('');
				$('#seenBox').html('');
				$('#seenBox').hide();
				$('#chatBox').show();
				bindDelete();
			});

			
			
		}
		
	});

	$('.pic').each(function(index, element){

		$(element).change(function(){
			
			var formdata = new FormData();
			var receiver = $('#friendId').val();
			var receiverName = $('#receiverName').val();

			formdata.append("pic", element.files[0]);
			formdata.append("receiver", receiver);
			formdata.append("receiverName", receiverName);
		
			var u = '/ajax/sendchatfile';
			
			req = new XMLHttpRequest();
	
			req.open("POST", u, true);
			req.send(formdata);
			req.onreadystatechange = function(){
				
				if(req.readyState == 4){
					//alert(req.responseText);
					if(req.responseText !== ''){
						$('#chatBox').html($('#chatBox').html() + req.responseText);
						$('#chats').scrollTop($('#chats')[0].scrollHeight - $('#chats')[0].clientHeight);
						$('#seenBox').html('');
						$('#seenBox').hide();
						$('#chatBox').show();
						bindDelete();
					}
					
				}
			}
			
		});
	});

	

	$('#deleteAll').click(function(){
		
		if($('#chatBox').html().match("[\\w]+")){
			if(confirm("This action will delete all messages.\nClick cancel to deny.\nClick ok to perform this action.")==true){

				var friendId = $('#friendId').val();

				var data = {
								friend: friendId
							};
				$.post('/ajax/deleteallchat', data, function(response){
					if(response === ''){
						$('#chatBox').html('');
						$('#chatBox').hide();
						$('#seenBox').hide();
					}
				});

			}
		}
	});

});