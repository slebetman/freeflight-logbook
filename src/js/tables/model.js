var brick = require('brick');

module.exports = function (DB,q,i) {
	
	return {
		create: function (ctx) {
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS model (
				name TEXT,
				notes TEXT,
				picture TEXT,
				meta TEXT
			)`);
		},
		methods: {
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
			}
		}
	}
}
