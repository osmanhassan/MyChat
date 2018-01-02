var db = require('./db');

function insert(params, callback){
	var sql = "INSERT INTO requests VALUES(null, ?, ?, ?)";
	db.execute(sql, [params.sender, params.receiver, params.status], function(flag){
		if(flag){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}

function myUnhadled(uid, callback){

	var sql = "SELECT * FROM requests WHERE receiver = ? AND status LIKE ?";

	db.getResult(sql, [uid, 'pending'], function(result){
		callback(result);
	});
}

function getPendings(params, callback){

	var sql = "SELECT * FROM requests WHERE sender = ? AND status LIKE ?";

	db.getResult(sql, [params.sender, 'pending'], function(result){
		callback(result);
	});
}

function getFriendRequests(params, callback){

	var sql = "SELECT users.uid, users.name, users.image, users.activity FROM users INNER JOIN requests ON users.uid = requests.sender AND requests.receiver = ? AND requests.status LIKE ?";
	db.getResult(sql, [params.receiver, 'pending'], function(result){
		callback(result);
	});
}

function getSentRequests(params, callback){

	var sql = "SELECT users.uid, users.name, users.image, users.activity FROM users INNER JOIN requests ON users.uid = requests.receiver AND requests.sender = ? AND requests.status LIKE ?";
	db.getResult(sql, [params.sender, 'pending'], function(result){
		callback(result);
	});
}

function updateRequest(params, callback){
	
	var sql = "UPDATE requests SET status=? WHERE sender=? AND receiver=? AND status LIKE ?";
	db.execute(sql, [params.status, params.sender, params.receiver, 'pending'], function(flag){
		callback(flag);	
	});

}

function validateFriend(params, callback){
	var sql = "SELECT * FROM requests WHERE ((sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)) AND status LIKE ?";
	db.getResult(sql,[params.uid, params.friend, params.friend, params.uid, 'accepted'], function(result){
		callback(result);
	});
}

function deleteRequest(params, callback){
	var sql = 'DELETE FROM requests WHERE ((sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)) AND (status LIKE ? OR status LIKE ?)';
	db.execute(sql, [params.me, params.friend, params.friend, params.me, 'accepted', 'cancelled'], function(flag){
		callback(flag);	
	});

}

module.exports = {
					insert,
					myUnhadled, 
					getPendings,
					deleteRequest,
					updateRequest,
					validateFriend,
					getSentRequests,
					getFriendRequests
				};