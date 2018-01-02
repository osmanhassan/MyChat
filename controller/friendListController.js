var express  = require('express');
var user = require('../models/user');
var notification = require('../models/notification');

var router = express.Router();

router.get('/', function(request, response){

	var uid = request.session.user.uid;

	user.findFriendlistFriends(uid, function(result){
		var params = {
						notifible: uid,
						type: 'accept/request'
					};
		notification.makeSeenByType(params, function(flag){
			response.render('users/friendList',{friends: result});
		});
		
	});
});

module.exports = router;