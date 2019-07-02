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
							log.rowid,
							log.*
						FROM log
							where log.model = ?
						`,
						model_id
					));
				});
			},
			getLocations: function(callback) {
				DB.transaction(function(ctx){
					q(ctx, callback,brick(`
						SELECT DISTINCT 
							location
						FROM log
						`
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
			}
		}
	}
}
