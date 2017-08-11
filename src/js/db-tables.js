var brick = require('brick');

/*
 * Log formats simply define which fields are enabled for the log.
 * Logs themselves contain all fields but also contain a field to specify
 * which fields are enabled (probably JSON)
 *
 * But how to support custom fields?
 */


module.exports = {
	init: function (db) {
		db.transaction(function(ctx){
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS model (
				id INTEGER PRIMARY KEY AUTOINCREMENT, 
				name TEXT,
				notes TEXT,
				log_format INTEGER
			)`);
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS log_format (
				id INTEGER PRIMARY KEY AUTOINCREMENT, 
				name TEXT
			)`);
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS log_fields (
				log_format INTEGER,
				field_type INTEGER
			)`);
			ctx.executeSql(`DROP TABLE IF EXISTS field_type`);
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS field_type (
				id INTEGER,
				name TEXT,
				type TEXT
			)`);
			ctx.executeSql(`INSERT INTO field_type (id, name, type) VALUES (1,"location","string")`);
			ctx.executeSql(`INSERT INTO field_type (id, name, type) VALUES (2,"rubber_thickness","length")`);
			ctx.executeSql(`INSERT INTO field_type (id, name, type) VALUES (3,"rubber_length","length")`);
			ctx.executeSql(`INSERT INTO field_type (id, name, type) VALUES (4,"windings","number")`);
			ctx.executeSql(`INSERT INTO field_type (id, name, type) VALUES (5,"backoff","number")`);
			ctx.executeSql(`INSERT INTO field_type (id, name, type) VALUES (6,"torque","force")`);
			ctx.executeSql(`INSERT INTO field_type (id, name, type) VALUES (7,"","")`);
			ctx.executeSql(`INSERT INTO field_type (id, name, type) VALUES (8,"duration","time")`);
			ctx.executeSql(`INSERT INTO field_type (id, name, type) VALUES (9,"","")`);
		},
		function(err){
			alert('Error processing SQL: '+err.code);
		},
		function(){}
	}
}