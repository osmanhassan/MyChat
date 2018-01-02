var express = require('express');
var user = require('../models/user');
var requests = require('../models/request');

var router = express.Router();

router.get('/', function(request, response){

	var uid = request.session.user.uid;

	user.findById(uid, function(result){

		var friendlist = result[0].friendlist;

		if(friendlist !== null){
			friendlist = JSON.parse(friendlist);
			friendlist.push(uid);
		}
		else
			friendlist = [uid];
		
		requests.myUnhadled(uid,function(list){

			for(l in list)
				friendlist.push(list[l].sender);
			
			user.findFriend(friendlist, function(result){
				
				var friends = result;

				requests.getPendings({sender: uid}, function(result1){

					var pendings = result1;
					
					for(friend in friends)
						friends[friend].requestProtocol = "SEND REQUEST";
					
					for(pending in pendings){
						var receiver = pendings[pending].receiver;
						for(friend in friends){
							if(receiver == friends[friend].uid)
								friends[friend].requestProtocol = "PENDING";
						}
					}

					var data = {friends};
					response.render('users/findfriend', data);
				
				});	
			});
		});
	});
});


module.exports = router;