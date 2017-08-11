var brick = require('brick');

/*
 * Log formats simply define which fields are enabled for the log.
 * Logs themselves contain all fields but also contain a field to specify
 * which fields are enabled (probably JSON)
 *
 * But how to support custom fields?
 */


module.exports = {
	init: function (db,callback) {
		db.transaction(function(ctx){
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS model (
				id INTEGER PRIMARY KEY AUTOINCREMENT, 
				name TEXT,
				notes TEXT,
				picture TEXT,
				meta TEXT,
			)`);
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS log_format (
				name TEXT,
				meta TEXT
			)`);
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS location (
				id INTEGER PRIMARY KEY AUTOINCREMENT, 
				name TEXT,
				notes TEXT,
				picture TEXT
			)`);
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS log (
				id INTEGER PRIMARY KEY AUTOINCREMENT, 
				model INTEGER,
				timestamp INTEGER,
				duration INTEGER,
				distance INTEGER,
				distance_unit TEXT,
				location INTEGER,
				windings INTEGER,
				backoff INTEGER,
				torque DOUBLE,
				torque_unit TEXT,
				rubber_length DOUBLE,
				rubber_length_unit TEXT,
				rubber_width DOUBLE,
				rubber_width_unit TEXT,
				notes TEXT
			)`);
		},
		function(err){
			alert('Error processing SQL: '+err.code);
			callback(err);
		},
		function(){
			callback();
		}
	}
}
