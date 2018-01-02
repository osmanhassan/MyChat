var express = require('express');
var requests = require('../models/request');
var notification = require('../models/notification');

var router = express.Router();

router.get('/friendrequests', function(request, response){
	var receiver = request.session.user.uid;

	requests.getFriendRequests({receiver: receiver}, function(result){
		var params = {
						notifible: receiver,
						type: 'friend/request'
					};
		notification.makeSeenByType(params, function(flag){
			response.render('users/friendRequests',{requests: result});
		});
		
	});
});

router.get('/sentrequests', function(request, response){
	var sender = request.session.user.uid;

	requests.getSentRequests({sender: sender}, function(result){
		response.render('users/sentRequests',{requests: result})
	});

});



module.exports = router;