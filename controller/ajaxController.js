var express = require('express');
var router = express.Router();

var user = require('../models/user');
var requests = require('../models/request');
var message = require('../models/message');
var notification = require('../models/notification');

var formidable = require('formidable');
var fs = require('fs');
var readChunk = require('read-chunk');
var fileType = require('file-type');


router.post('/seachusername', function(request, response){
	var userName = request.body.name;
	user.findByName(userName, function(result){
    	if(result.length == 0)
    		response.send("");
	    else 
	    	response.send(userName + " is already taken try with another one.");	    
	}); 
});

router.post('/checkpass', function(request, response){
	var password = request.body.password;
	var uid = request.session.user.uid;
	user.findById(uid, function(result){
    	if(result[0].password === password)
    		response.send("");
	    else 
	    	response.send("Previous Password must match with your password.");	    
	}); 
});

router.post("/image", function(req, res){

    var form = new formidable.IncomingForm();
    var uid = req.session.user.uid;

    form.parse(req, function (err, fields, files) {
    	var buffer = readChunk.sync(files.pic.path, 0, 4100);
	    var extension = fileType(buffer);
	    var mime = extension.mime.split("/");
	    mime = mime[0];
	    if(mime === 'image'){
	    	
	    	//console.log(extension);
	    	var extension = extension.ext;

			var oldpath = files.pic.path;
			var newpath = './public/images/uploads/user/' + uid +'.'+extension;

			fs.rename(oldpath, newpath, function (err) {

				if (err) 
					console.log(err);
				var timeStamp = Math.floor(Date.now());
				var path = '/images/uploads/user/' + uid +'.'+extension;
				
				req.session.user.image = path;
				
				var data= req.session.user;
				
				user.updateUser(data, function(flag){

					if(flag){
						res.send(path + '?nocache=<' + timeStamp);
					}
					else
						console.log('Could not insert image in DB!');
				});
				
				    //res.end();
			});
		}
		else{
			console.log('Bad file upload try!');
		}
  	});
});

router.post('/changeactivity', function(request, response){
	var activity = request.body.activity;
	var name = request.session.user.name;

	request.session.user.activity = activity;

	var data= request.session.user;

	user.updateUser(data, function(flag){

		if(flag){
			console.log(name + ' is now in ' + activity);
			response.send('You are in ' + activity);
		}
		else{
			console.log(name + ' could not go in ' + activity);
			response.send('Fatal error occered. You can not go in ' + activity);
		}
	});
	
});

router.post('/sendrequest', function(request, response){

	var sender = request.session.user.uid;
	var receiver = request.body.rid;
	var senderName = request.session.user.name;

	var params = {
					sender: sender,
					receiver: receiver,
					status: 'pending'
				};

	requests.insert(params, function(flag){

		if(flag){
			var name = request.session.user.name;
			var description = name + ' sent you friend request.';
			params ={
						notifier: sender,
						notifible: receiver,
						type: 'friend/request',
						description: description
					};
			notification.insert(params, function(flag1){
				console.log(senderName + ' has sent friend request to uid: ' + receiver);
				response.send('PENDING');
			});	
		}
		else{
			console.log(senderName + ' could not send friend request to uid: ' + receiver);
			response.send('CANT SEND');
		}
	});

});

router.post('/unfriend', function(request, response){

	var friend 	= request.body.uid;
	var me 		= request.session.user.uid;
	var params 	= {
					me: me,
					friend: friend
				  };

	requests.deleteRequest(params, function(flag){

		user.findById(friend, function(result){

			var list = result[0].friendlist;
			list = JSON.parse(list);
			var mlist = [];
			for(var i = 0; i< list.length; i++){
				if(list[i] != me)
					mlist.push(list[i]);
			}
			mlist = JSON.stringify(mlist);
			params = {
						uid: friend,
						friendlist: mlist
					};

			user.updateFriendlist(params, function(flag1){

				user.findById(me, function(result1){

					list = result1[0].friendlist;
					list = JSON.parse(list);
					mlist = [];
					for(var i = 0; i< list.length; i++){
						if(list[i] != friend)
							mlist.push(list[i]);
					}
					mlist = JSON.stringify(mlist);
					params = {
								uid: me,
								friendlist: mlist
							};

					user.updateFriendlist(params, function(flag2){

						response.send('done');
					});
				});
			});
		});
	});
});

router.post('/changestatus', function(request, response){

	var status = request.body.status;
	var sender = request.body.uid;
	var receiver = request.session.user.uid;
	
	if(request.body.myRequest)
		var params ={
						sender: receiver,
						receiver: sender,
						status: status
					};
	else
		var params ={
						sender: sender,
						receiver: receiver,
						status: status
					};
	
	requests.updateRequest(params, function(flag){

		if(status == 'accepted'){
			//console.log(status);
			user.findById(sender, function(result){

				var friendlist = result[0].friendlist;

				var newList = [receiver];

				if(friendlist !== null){

					friendlist = JSON.parse(friendlist);
					friendlist.push(receiver);
					newList = friendlist;
				}

				newList = JSON.stringify(newList);
				params = {
							uid: sender,
							friendlist: newList
						};
				user.updateFriendlist(params, function(flag1){

					user.findById(receiver, function(result1){

						friendlist = result1[0].friendlist;

						newList = [sender];

						if(friendlist !== null){

							friendlist = JSON.parse(friendlist);
							friendlist.push(sender);
							newList = friendlist;
						}

						newList = JSON.stringify(newList);
						params = {
									uid: receiver,
									friendlist: newList
								};
						user.updateFriendlist(params, function(flag2){

								var name = request.session.user.name;
								var description = name + ' accepted your request.';
								params ={
											notifier: receiver,
											notifible: sender,
											type: 'accept/request',
											description: description
										};
								
								notification.insert(params, function(flag3){	
									console.log('uid: ' + sender + ' uid: ' + receiver + ' are now friends.');

								});	
						

						});

					});

				});

			});
		}

		response.send('done');

	});

});

router.post('/chat', function(request, response){

	var r = '';
	var uid = request.session.user.uid;

	user.MessageSenderFriends(uid, function(result){
		var mfriends = result;

		for(friend in mfriends){
			var activity = mfriends[friend].activity;

			if(activity == 'online')
				var src = '/images/green_round_btn.PNG';
			else
				var src = '/images/red_round_btn.PNG'; 

			var size = '';
			if((mfriends[friend].sender == uid && mfriends[friend].sender_deny == 0) || (mfriends[friend].receiver != uid && mfriends[friend].sender_deny == 0)){
				var display = ';display: block;';
			}
			else{
				var display = ';display: none;';
			}

			if(mfriends[friend].type == 'txt'){
				var description = mfriends[friend].description;
			}
			else{
				var description = 'sent a photo';
			}
			if(mfriends[friend].sender == uid){
				var name = 'You';
				
			}
			else{
				var name = mfriends[friend].name;

				if(mfriends[friend].status ==='unseen')
				size = 'bolder';
			}

			r += '<a href="/chat/' + mfriends[friend].uid + '" style="text-decoration: none;"><div class="card" style="margin: 10px 0 0 0"><div class="card-header chat-body" ><img src="' + mfriends[friend].image + '" style="width: 50px;height: 50px;border-radius: 50%"><span style="line-height: 15px;margin-left: 5px">' + mfriends[friend].name + '</span><div style="width: 30px;height: 30px;border-radius: 50%; background-color: transparent;float: right;"><img src="' + src + '" style="width: 100%;height: 100%;border-radius: 50%"></div></div><div class="card-footer chat-body" style="' + display + '"><div style="width: 70%;height:30px;overflow: hidden;float: left; font-weight: ' + size + '">' + name + ': ' + description + '</div>';

			if(name === 'You')
				r += '<div style="float: right;width: 25%;text-align: right;">' + mfriends[friend].status +'</div>';
			
			r += '</div></div></a>';			
		} 

		

		user.NoMessageSenderFriends(uid, function(result1){
			
			mfriends = result1;

			for(friend in mfriends){
				activity = mfriends[friend].activity;

				if(activity == 'online')
					src = '/images/green_round_btn.PNG';
				else
					src = '/images/red_round_btn.PNG'; 

				

				r += '<a href="/chat/' + mfriends[friend].uid + '" style="text-decoration: none;"><div class="card" style="margin: 10px 0 0 0"><div class="card-header chat-body" ><img src="' + mfriends[friend].image + '" style="width: 50px;height: 50px;border-radius: 50%"><span style="line-height: 15px;margin-left: 5px">' + mfriends[friend].name + '</span><div style="width: 30px;height: 30px;border-radius: 50%; background-color: transparent;float: right;"><img src="' + src + '" style="width: 100%;height: 100%;border-radius: 50%"></div></div></div></a>';
				
			} 
			response.send(r);	
		});
	});
});


router.post('/sendchat', function(request, response){
	var receiver = request.body.receiver;
	var chat = request.body.message;
	var sender = request.session.user.uid;

	var params = {
					sender: sender,
					receiver: receiver,
					chat: chat,
					type: 'txt',
					status: 'unseen'
				};
	

	message.insert(params, function(id){

		chat = chat.replace(/[\r\n]/g, "</br>");
		var res = '<div class ="mybox" id="mb' + id + '"><div class="receiver">' + chat + '</div><span class="deletebtnr" id="' + id + '" name="delete">DELETE</span></div>';
		
		var name = request.session.user.name;
		var description = name + ' sent you message.';
		params ={
					notifier: sender,
					notifible: receiver,
					type: 'message/txt',
					description: description
				};
		
		notification.insert(params, function(flag1){	
			response.send(res);
		});	

	});

});

router.post('/updatechatbox', function(request, response){

	var sender = request.body.sender;
	var receiver = request.session.user.uid;

	var params = {
					sender: sender,
					receiver: receiver,
					status: 'unseen'
				};

	message.getUnseenMessage(params, function(result){
		var res = '';

		if(result.length > 0){
			for(var r in result){
				var d = result[r].description;
				var t = result[r].type;
				if(t == 'txt'){
					var ri = '<div class ="mybox" id="mb' + result[r].mid + '"><div class="sender">';
					d = d.replace(/[\r\n]/g, "</br>");
					ri += d;
					ri += '</div><span class="deletebtnl" id="' + result[r].mid + '" name="delete">DELETE</span></div>';
				}
				else{
					var ri = '<div class ="mybox" id="mb' + result[r].mid + '"><img src="' + d + '" class="receiverimage"><span class="deletebtnl" id="' + result[r].mid + '" name="delete">DELETE</span></div>';
				}
				res += ri;
			}

			message.makeSeen(params,function(flag){

				params = {
							notifible: receiver,
							notifier: sender
						};
				notification.deleteByNotifier(params, function(flag1){

					response.send(res);
				});
				
			});
		}
		else{
			params = {
						sender: receiver,
						receiver: sender
					};

			message.getLastSent(params, function(result1){
				if(result1.length > 0){
					var status = result1[0].status;
					 sender = result1[0].sender;
					 var senderDeny = result1[0].sender_deny;
					if(status == 'seen' && sender == receiver && senderDeny == 0)
						response.send(status);
					else
						response.send('');
				}
				else{
					response.send('');
				}
			});
		}
	});

});


router.post("/sendchatfile", function(req, res){

    var form = new formidable.IncomingForm();
    var uid = req.session.user.uid;
    
    var senderName = req.session.user.name;
    var timeStamp = Math.floor(Date.now());

    form.parse(req, function (err, fields, files) {
    	var receiver = fields.receiver;
    	var receiverName = fields.receiverName;
    	var buffer = readChunk.sync(files.pic.path, 0, 4100);
	    var extension = fileType(buffer);
	    var mime = extension.mime.split("/");
	    mime = mime[0];
	    if(mime === 'image'){
	    	
	    	//console.log(extension);
	    	var extension = extension.ext;

			var oldpath = files.pic.path;
			var newpath = './public/images/uploads/message/' + senderName + receiverName + timeStamp + '.' + extension;

			fs.rename(oldpath, newpath, function (err) {

				if (err) 
					console.log(err);
				//var timeStamp = Math.floor(Date.now());
				var path = '/images/uploads/message/' + senderName + receiverName + timeStamp + '.' + extension;
				
				
				
				var params = {
					sender: uid,
					receiver: receiver,
					chat: path,
					type: 'file/image',
					status: 'unseen'
				};
	
				message.insert(params, function(id){

					if(id){
						var src = path + '?nocache=<' + timeStamp;
						var response = '<div class ="mybox" id="mb' + id + '"><img src="' + src + '" class="senderimage"><span class="deletebtnr" id="' + id + '" name="delete">DELETE</span></div>';

						var name = req.session.user.name;
						var description = name + ' sent you photo.';
						params ={
									notifier: uid,
									notifible: receiver,
									type: 'message/image',
									description: description
								};
						
						notification.insert(params, function(flag1){	
							res.send(response);
						});	
						
					}
					else{
						console.log('Could not insert image in DB!');
						res.send('');
					}
				});
				
				
				    //res.end();
			});
		}
		else{
			console.log('Bad file upload try!');
			res.send('');
		}
  	});
});

router.post('/deletechatbyid', function(request, response){

	var mid = request.body.mid;
	var uid = request.session.user.uid;

	var params = {
					uid: uid,
					mid: mid
				};
	message.deleteChatById(params, function(flag){
		if(flag)
			response.send('');
		else
			response.send('error');
	});

});

router.post('/deleteallchat', function(request, response){

	var friend = request.body.friend;
	var uid = request.session.user.uid;
	var params = {
					friend: friend,
					uid: uid
				};

	message.deleteAll(params, function(flag){
		if(flag)
			response.send('');
		else
			response.send('error');
	});

});


router.post('/countunseennotification', function(request, response){
	var uid = request.session.user.uid;
	notification.getUnseenCount(uid, function(result){
		response.send(String(result[0].count));
	});
});

router.post('/giveNotification', function(request, response){

	var uid = request.session.user.uid;

	notification.getNotifications(uid, function(result){
		var res = '';
		var href = '';
		var color = 'class="mchat-body"';

		for(var r in result){
			if(result[r].type === 'message/txt' || result[r].type == 'message/image')
				href = '/chat/' + result[r].notifier;

			if(result[r].type === 'accept/request')
				href = '/friendlist';

			if(result[r].type === 'friend/request')
				href = '/requests/friendrequests';

			color = 'class="mchat-body"';

			if(result[r].status === 'seen')
				color = 'class="mchat-body" style= "background-image: none; color: #000"';

			res += '<a href = "' + href + '"><div ' + color + ' style="margin-top: 10px"><img src="' + result[r].image + '" class="fimage" />' + result[r].description + '</div></a>';
		}
		
		response.send(res);

	});

});

module.exports = router;