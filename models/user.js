var db = require('./db');

function insert(params, callback){
	var sql = "INSERT INTO users VALUES(null, ?, ?, ?, ?, null)";
	db.execute(sql, [params.userName, params.password, params.image, params.activity], function(result){
		if(result){
			callback(true);
		}
		else{
			callback(false);
		}
	});
}

function findByName(name, callback){
	var sql = 'SELECT * FROM users WHERE name LIKE ?';
	db.getResult(sql, [name], function(result){
		callback(result);
	});
}

function findById(uid, callback){
	var sql = 'SELECT * FROM users WHERE uid = ?';
	db.getResult(sql, [uid], function(result){
		callback(result);
	});
}

function getUserByNamePass(params, callback){
	var sql = 'SELECT * FROM users WHERE name LIKE ? AND password LIKE ?';
	db.getResult(sql, [params.userName, params.password], function(result){
		callback(result);
	});
}

function updateUser(params, callback){
	var sql = "UPDATE users SET name=?, password=?, image=?, activity=? WHERE uid=?";
	db.execute(sql, [params.name, params.password, params.image, params.activity, params.uid], function(flag){
		callback(flag);
	});
}

function findFriend(params, callback){
	var sql = "SELECT * FROM users WHERE uid !=  ? ";
	for(var i = 1; i < params.length; i++)
		sql += 'AND uid != ? ';
	
	db.getResult(sql, params, function(result){
		callback(result);
	});
}

function findFriendlistFriends(uid, callback){

	var sql = "SELECT DISTINCT users.uid, users.name, users.image, users.activity FROM users, requests WHERE ((requests.sender = ? OR requests.receiver = ?) AND requests.status LIKE ? AND users.uid != ?) AND (users.uid = requests.sender OR users.uid = requests.receiver)";
	db.getResult(sql, [uid, uid, 'accepted', uid], function(result){
		callback(result);
	});

}

function updateFriendlist(params, callback){

	var sql = "UPDATE users SET friendlist=? WHERE uid=?";
	db.execute(sql, [params.friendlist, params.uid], function(flag){
		callback(flag);
	});

}

function MessageSenderFriends(uid, callback){

	var sql = "SELECT g.uid, g.name, g.image, g.activity, g.mid, g.sender, g.description, g.type, g.status, g.sender_deny, g.receiver_deny FROM(SELECT * FROM(SELECT DISTINCT users.uid, users.name, users.image, users.activity, b.mid,b.sender, b.description, b.type,b.status, b.sender_deny, b.receiver_deny FROM users INNER JOIN(SELECT * FROM messages WHERE mid in( SELECT max(mid) as m FROM messages WHERE messages.receiver = ? or messages.sender = ? GROUP BY messages.sender,messages.receiver DESC))AS b ON users.uid = b.receiver or users.uid = b.sender WHERE users.uid != ? ORDER BY b.mid DESC)t GROUP BY uid ORDER BY mid desc)g INNER JOIN requests ON g.uid = requests.sender OR g.uid = requests.receiver WHERE (requests.sender = ? OR requests.receiver = ?) AND requests.status = ?";
	db.getResult(sql, [uid, uid, uid, uid, uid, 'accepted'], function(result){
		callback(result);
	});

}

function NoMessageSenderFriends(uid, callback){

	var sql = "SELECT * FROM users INNER JOIN requests ON users.uid = requests.sender OR users.uid = requests.receiver WHERE users.uid != ? AND (requests.sender = ? OR requests.receiver = ?) AND requests.status LIKE ? AND users.uid NOT IN(SELECT * FROM(SELECT DISTINCT users.uid FROM users INNER JOIN(SELECT * FROM messages WHERE mid in( SELECT max(mid) as m FROM messages WHERE messages.receiver = ? or messages.sender = ? GROUP BY messages.sender,messages.receiver DESC))AS b ON users.uid = b.receiver or users.uid = b.sender WHERE users.uid != ? ORDER BY b.mid DESC)t GROUP BY uid) ORDER BY users.uid DESC";
	db.getResult(sql, [uid, uid, uid, 'accepted', uid, uid, uid], function(result){
		callback(result);
	});

}

module.exports = {	
					insert, 
					findById,
					findByName,
					updateUser,
					findFriend,
					updateFriendlist,
					getUserByNamePass,
					MessageSenderFriends,
					findFriendlistFriends,
					NoMessageSenderFriends
				};