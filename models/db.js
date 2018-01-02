var mysql = require('mysql');

var connection = mysql.createConnection({

	host: '127.0.0.1',
	user: 'root',
	password: '',
	database: 'node_chat_db'
});
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
});

function getResult(sql, params, callback){

	if(params == null){
		connection.query(sql, function(error, result){

			if(error){
				console.log(error.stack);
				callback([]);
			}
			else{
				callback(result);
			}
		});
	}
	else{

		connection.query(sql, params, function(error, result){
			if(error){
				console.log(error.stack);
				callback([]);
			}
			else{
				callback(result);
			}
		});
	}
}

function execute(sql, params, callback){

	if(params == null){

		connection.query(sql, function(error, result){
			if(error){
				console.log(error.stack);
				callback(false);
			}
			else{
				callback(true);
			}
		});
	}
	else{
		connection.query(sql, params, function(error, result){
			if(error){
				console.log(error.stack);
				callback(false);
			}
			else{
				callback(true);
			}
		});
	}
}

function executeGetId(sql, params, callback){
	if(params == null)
	{
		connection.query(sql, function (error, result) {
			if(error)
			{
				console.log(error.stack);
				callback(-1);
			}
			else
			{
				callback(result.insertId);
			}
		});
	}
	else
	{
		connection.query(sql, params, function (error, result) {
			if(error)
			{
				console.log(error.stack);
				callback(-1);
			}
			else
			{
				callback(result.insertId);
			}
		});
	}
}
module.exports = {getResult, execute, executeGetId};