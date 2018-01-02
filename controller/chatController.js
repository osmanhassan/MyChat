var express = require('express');
var user = require('../models/user');
var requests = require('../models/request');
var message = require('../models/message');
var notification = require('../models/notification');

var router = express.Router();

router.get('/', function(request, response){

	var uid = request.session.user.uid;

	user.MessageSenderFriends(uid, function(result){
		var mfriends = result;

		user.NoMessageSenderFriends(uid, function(result1){
			var friends = result1;
			
			response.render('users/chat',{mfriends: mfriends, friends: friends, uid: uid});
		});
		
	});
});

router.get('/:friend', function(request, response){

	var friend = request.params.friend;
	
	var uid = request.session.user.uid;

	var params = {
					uid: uid,
					friend: friend
				};

	requests.validateFriend(params, function(result){

		if(result.length > 0){
			user.findById(friend, function(result1){
				var myFriend = result1;
				params = {
						sender: friend,
						receiver: uid,
						status: 'unseen'
					};
				message.makeSeen(params, function(flag){
					 params = {
								uid: uid,
								friend: friend
							};
					message.getMessages(params, function(result2){
						
						params = {
									notifible: uid,
									notifier: friend
								};
						notification.makeSeenByNotifier(params, function(flag1){

							response.render('users/chatBox', {chats : result2, friend: myFriend, myId: uid, friendId: friend});

						});
					});

				});
				
			});
		}
		else{
			response.redirect('/chat');
		}
	});
});

module.exports = router;