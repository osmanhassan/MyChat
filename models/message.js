var db = require('./db');

function insert(params, callback){
	var sql = "INSERT INTO messages VALUES(null, ?, ?, ?, ?, ?, ?, ?, null)";
	db.executeGetId(sql, [params.sender, params.receiver, 0, 0, params.type, params.status, params.chat], function(id){
		
		callback(id);
		
	});
}

function getMessages(params, callback){
	var sql = "SELECT * FROM messages WHERE (sender = ? AND receiver = ? AND sender_deny = ?) OR (sender = ? AND receiver = ? AND receiver_deny = ?)";

	db.getResult(sql,[params.uid, params.friend, 0, params.friend, params.uid, 0], function(result){
		callback(result);
	});
}

function getMessageById(id, callback){
	var sql = 'SELECT * FROM messages WHERE mid = ?';
	db.getResult(sql,[id], function(result){
		callback(result);
	});
}

function getUnseenMessage(params, callback){
	var sql = 'SELECT * FROM messages WHERE sender = ? AND receiver = ? AND status LIKE ?';
	db.getResult(sql,[params.sender, params.receiver, params.status], function(result){
		callback(result);
	});
}

function makeSeen(params, callback){

	var sql = "UPDATE messages SET status = ? WHERE sender = ? AND receiver = ? AND status = ?";
	db.execute(sql, ['seen', params.sender, params.receiver, params.status], function(flag){
		callback(flag);
	});

}

function getLastSent(params, callback){

	var sql = 'SELECT * FROM messages WHERE ((sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)) ORDER BY mid DESC LIMIT ?';
	db.getResult(sql,[params.sender, params.receiver, params.receiver, params.sender, 1], function(result){
		callback(result);
	});

}

function deleteChatById(params, callback){
	
	var sql = "UPDATE messages SET sender_deny = ? WHERE sender = ? AND mid = ?";
	
	db.execute(sql, [1, params.uid, params.mid], function(flag){
		
		sql = "UPDATE messages SET receiver_deny = ? WHERE receiver = ? AND mid = ?";
		
		db.execute(sql, [1, params.uid, params.mid], function(flag1){
			callback(flag || flag1);
		});
	
	});

}

function deleteAll(params, callback){

	var sql = "UPDATE messages SET sender_deny = ? WHERE sender = ? AND receiver = ?";
	
	db.execute(sql, [1, params.uid, params.friend], function(flag){
		
		sql = "UPDATE messages SET receiver_deny = ? WHERE receiver = ? AND sender = ?";
		
		db.execute(sql, [1, params.uid, params.friend], function(flag1){
			callback(flag || flag1);
		});
	
	});
}

module.exports = {	
					insert,
					makeSeen,
					deleteAll,
					getLastSent, 
					getMessages, 
					getMessageById,
					deleteChatById, 
					getUnseenMessage

				};