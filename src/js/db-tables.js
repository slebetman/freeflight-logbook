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

var formats = [
	{
		name: 'Simple',
		meta: {
			fields: [
				'duration',
				'location',
				'windings',
				'rubber_length',
				'rubber_width',
				'notes'
			]
		}
	},
	{
		name: 'Glider',
		meta: {
			fields: [
				'duration',
				'location',
				'notes'
			]
		}
	},
	{
		name: 'Torque',
		meta: {
			fields: [
				'duration',
				'location',
				'torque',
				'rubber_length',
				'rubber_width',
				'notes'
			]
		}
	}
]

window.DB = null;

var tables = {
	setDB: function (db) {
		DB = db;
	},
	init: function (callback) {
		DB.transaction(function(ctx){
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS model (
				name TEXT,
				notes TEXT,
				picture TEXT,
				meta TEXT
			)`);
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS log_format (
				name TEXT,
				meta TEXT
			)`,[],function(ctx, result){
				ctx.executeSql('SELECT count(rowid) as c from log_format',[],
					function(ctx, result) {
						console.log(result);
						if (result.rows[0].c <= 0) {
							tables.initLogFormat(ctx);
						}
					}
				);
			});
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS location (
				name TEXT,
				notes TEXT,
				picture TEXT
			)`);
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS log (
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
		});
	},
	initLogFormat: function (ctx) {
		formats.forEach(function(f){
			ctx.executeSql(
				brick('INSERT INTO log_format VALUES (?,?)',
					f.name,
					JSON.stringify(f.meta)
				)
			);
		});
	},
	models: function (callback) {
		DB.transaction(function(ctx){
			q(ctx,callback,
				'SELECT rowid, * FORM model'
			);
		});
	},
	addModel: function (data, callback) {
		DB.transaction(function(ctx){
			i(ctx, callback,
				brick('INSERT INTO model VALUES (?,?,?,?)',
					data.name,
					data.notes,
					data.picture,
					data.meta
				)
			);
		});
	},
	logs: function (model_id, callback) {
		DB.transaction(function(ctx){
			q(ctx, callback,brick(`
				SELECT
					log.rowid,
					log.*, 
					location.name as location, 
					location.id as location_id
				FORM log
				JOIN location on location.id = log.location
					where log.model = ?
				`,
				model_id
			));
		});
	},
	addLog: function (data, callback) {
		DB.transaction(function(ctx){
			i(ctx, callback,
				brick('INSERT INTO log VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
					data.model,
					data.timestamp,
					data.duration,
					data.distance,
					data.distance_unit,
					data.location,
					data.windings,
					data.backoff,
					data.torque,
					data.torque_unit,
					data.rubber_length,
					data.rubber_length_unit,
					data.rubber_width,
					data.rubber_width_unit,
					data.notes
				)
			);
		});
	},
	locations: function (callback) {
		DB.transaction(function(ctx){
			q(ctx,callback,
				'SELECT rowid, * FROM location'
			);
		});
	},
	addLocation: function (data, callback) {
		DB.transaction(function(ctx){
			i(ctx, callback,
				brick('INSERT INTO location VALUES (?,?,?)',
					data.name,
					data.notes,
					data.picture
				)
			);
		});
	},
	log_formats: function (callback) {
		DB.transaction(function(ctx){
			q(ctx,callback,
				'SELECT rowid, * FROM log_format'
			);
		});
	}
}

module.exports = tables;