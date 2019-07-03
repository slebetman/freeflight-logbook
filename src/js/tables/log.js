var brick = require('brick');

module.exports = function (DB,q,i) {
	
	return {
		name: 'log',
		create: function (ctx) {
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS log (
				model INTEGER,
				timestamp INTEGER,
				duration INTEGER,
				distance INTEGER,
				distance_unit TEXT,
				location TEXT,
				windings INTEGER,
				backoff INTEGER,
				torque DOUBLE,
				torque_unit TEXT,
				rubber_length TEXT,
				rubber_length_unit TEXT,
				rubber_width TEXT,
				rubber_width_unit TEXT,
				rubber_weight DOUBLE,
				rubber_weight_unit TEXT,
				notes TEXT
			)`);
		},
		methods: {
			logs: function (model_id, callback) {
				DB.transaction(function(ctx){
					q(ctx, callback,brick(`
						SELECT
							rowid,
							*
						FROM log
							where model = ?
						`,
						model_id
					));
				});
			},
			getLogById: function (rowid, callback) {
				DB.transaction(function(ctx){
					q(ctx, row => callback(row[0]),brick(`
						SELECT
							rowid,
							*
						FROM log
							where rowid = ?
						`,
						rowid
					));
				});
			},
			getLocations: function(callback) {
				DB.transaction(function(ctx){
					q(ctx, function(r){
						callback(r.map(function(x){return x.location}));
					}, brick(`
						SELECT DISTINCT 
							location
						FROM log
						`
					));
				});
			},
			getLogCount: function (callback) {
				DB.transaction(function(ctx){
					q(ctx, callback, brick(`
						SELECT
							model, 
							count(rowid) as logs
						FROM log
						GROUP BY
							model
						`
					));
				});
			},
			deleteLogByModel: function(model_id, callback) {
				DB.transaction(function(ctx){
					q(ctx, callback, brick(`
						DELETE FROM log
						WHERE
							model = ?
						`,
						model_id
					));
				});
			},
			addLog: function (data, callback) {
				DB.transaction(function(ctx){
					i(ctx, callback,
						brick('INSERT INTO log VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
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
							data.rubber_weight,
							data.rubber_weight_unit,
							data.notes
						)
					);
				});
			},
			saveLog: function (rowid, data, callback) {
				DB.transaction(function(ctx){
					q(ctx, callback,
						brick(`
							UPDATE log
							SET
								location = ?,
								windings = ?,
								backoff = ?,
								torque = ?,
								torque_unit = ?,
								rubber_length = ?,
								rubber_length_unit = ?,
								rubber_width = ?,
								rubber_width_unit = ?,
								rubber_weight = ?,
								rubber_weight_unit = ?,
								notes = ?
							WHERE rowid = ?
						`,
							data.location,
							data.windings,
							data.backoff,
							data.torque,
							data.torque_unit,
							data.rubber_length,
							data.rubber_length_unit,
							data.rubber_width,
							data.rubber_width_unit,
							data.rubber_weight,
							data.rubber_weight_unit,
							data.notes,
							rowid
						)
					);
				});
			}
		}
	}
}
