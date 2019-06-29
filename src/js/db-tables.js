var brick = require('brick');

/*
 * Log formats simply define which fields are enabled for the log.
 * Logs themselves contain all fields but also contain a field to specify
 * which fields are enabled (probably JSON)
 *
 * But how to support custom fields?
 */

function query (ctx, callback, query) {
	var params = [];
	if (query instanceof brick) {
		params = query.params;
		query = query.text;
	}
	console.log(query);
	ctx.executeSql(query,params,
		function(ctx,result){
			console.log(result);
			callback(result.rows);
		},
		function(ctx,err){
			console.error(err.message);
			alert(err.message);
		}
	);
}

function insert (ctx, callback, query) {
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
		require('./tables/model')(DB,query,insert),
		require('./tables/log_format')(DB,query,insert),
		require('./tables/settings')(DB,query,insert),
		require('./tables/location')(DB,query,insert),
		require('./tables/log')(DB,query,insert)
	];
	
	DB.transaction(function(ctx){
		console.log('inside transaction');
		
		console.log(tableList.map(x=>x.name).join(','));
		
		for (var i=0; i<tableList.length; i++) {
			console.log('creating table ', tableList[i].name);
			tableList[i].create(ctx);
		}
	},
	function(err){
		alert('Error processing SQL: '+err.code+' - '+err.message);
		console.error('error:',err.message);
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