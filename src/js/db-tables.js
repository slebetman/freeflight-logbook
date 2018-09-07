var brick = require('brick');

/*
 * Log formats simply define which fields are enabled for the log.
 * Logs themselves contain all fields but also contain a field to specify
 * which fields are enabled (probably JSON)
 *
 * But how to support custom fields?
 */

function q (ctx, callback, query) {
	var params = [];
	if (query instanceof brick) {
		params = query.params;
		query = query.text;
	}
	console.log(query);
	ctx.executeSql(query,params, function(ctx,result){
		callback(result.rows);
	});
}

function i (ctx, callback, query) {
	var params = [];
	if (query instanceof brick) {
		params = query.params;
		query = query.text;
	}
	console.log(query);
	ctx.executeSql(query,params, function (ctx, result) {
		callback(result.insertId);
	});
}

window.DB = null;

var tables = {
	setDB: function (db) {
		DB = db;
	}
}

tables.init = function (callback) {
	console.log('init db');
	
	var tableList = [
		require('./tables/model')(DB,q,i),
		require('./tables/log_format')(DB,q,i),
		require('./tables/settings')(DB,q,i),
		require('./tables/location')(DB,q,i),
		require('./tables/log')(DB,q,i)
	];
	
	DB.transaction(function(ctx){
		console.log('inside transaction');
		
		for (var i=0; i<tableList.length; i++) {
			tableList[i].create(ctx);
		}
	},
	function(err){
		alert('Error processing SQL: '+err.code);
		console.log(err);
		callback(err);
	},
	function(){
		callback();
	});
	
	for (var i=0; i<tableList.length; i++) {
		for (var m in tableList[i].methods) {
			tables[m] = tableList[i].methods[m];
		}
	}
};

window.TABLES = tables;
module.exports = tables;