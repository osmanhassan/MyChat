var db = require('./db');

function insert(params, callback){
	var sql = "INSERT INTO notifications VALUES(null, ?, ?, ?, ?, ?)";

	db.execute(sql, [params.notifier, params.notifible, params.type, params.description, 'unseen'], function(flag){
		callback(flag);	
	});
}

function getUnseenCount(uid, callback){
	var sql = 'SELECT COUNT(nid) As count FROM notifications WHERE notifible = ? AND status LIKE ?';

	db.getResult(sql, [uid, 'unseen'], function(result){
		callback(result);
	});
}

function getNotifications(uid, callback){

	var sql = 'SELECT users.uid, users.image, notifications.nid, notifications.notifier, notifications.status, notifications.type, notifications.description FROM users INNER JOIN notifications ON users.uid = notifications.notifier WHERE notifications.notifible = ? ORDER BY notifications.nid DESC';

	db.getResult(sql, [uid], function(result){
		callback(result);
	});
}

function makeSeenByType(params, callback){

	var sql = "UPDATE notifications SET status = ? WHERE notifible = ? AND type LIKE ? AND status LIKE ?";

	db.execute(sql, ['seen', params.notifible, params.type, 'unseen'], function(flag){
		callback(flag);	
	});
}

function makeSeenByNotifier(params, callback){

	var sql = "UPDATE notifications SET status = ? WHERE notifible = ? AND notifier = ? AND (type LIKE ?  OR type LIKE ?) AND status LIKE ?";

	db.execute(sql, ['seen', params.notifible, params.notifier, 'message/txt', 'message/image', 'unseen'], function(flag){
		callback(flag);	
	});
}

function deleteByNotifier(params, callback){

	var sql = "DELETE FROM notifications WHERE notifible = ? AND notifier = ? AND (type LIKE ?  OR type LIKE ?) ";

	db.execute(sql, [params.notifible, params.notifier, 'message/txt', 'message/image'], function(flag){
		callback(flag);	
	});
}

module.exports = {
					insert, 
					getUnseenCount,
					makeSeenByType,
					getNotifications,
					deleteByNotifier,
					makeSeenByNotifier
				};