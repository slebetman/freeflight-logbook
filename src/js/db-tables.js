var brick = require('brick');

/*
 * Log formats simply define which fields are enabled for the log.
 * Logs themselves contain all fields but also contain a field to specify
 * which fields are enabled (probably JSON)
 *
 * But how to support custom fields?
 */

function q (ctx, callback, query) {
	ctx.executeSql(query, [], function(ctx,result){
		callback(result.rows);
	});
}

function i (ctx, callback, query) {
	ctx.executeSql(query,[], function (ctx, result) {
		callback(result.insertId);
	});
}

window.DB = null;

var tableList = [
	'model',
	'log_format',
	'settings',
	'location',
	'log'
]
.map(function(t){
	return require(t)(q,i);
});

var tables = {
	setDB: function (db) {
		DB = db;
	}
}

tables.init = function (callback) {
	console.log('init db');
	
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
});

for (var i=0; i<tableList.length; i++) {
	for (var m in tableList[i].methods) {
		tables[m] = tableList[i].methods[m];
	}
}

module.exports = tables;