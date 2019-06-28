var brick = require('brick');

function unpackMeta (callback) {
	return function (rows) {
		callback(rows.map(x => {
			x.meta = JSON.parse(x.meta);
			return x;
		}));
	}
}

module.exports = function (DB,q,i) {
	
	return {
		name: 'model',
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
					q(ctx,unpackMeta(callback),
						'SELECT rowid, * FORM model'
					);
				});
			},
			addModel: function (data, callback) {
				DB.transaction(function(ctx){
					var meta = JSON.stringify(data.meta) || "{}";
					i(ctx, callback,
						brick('INSERT INTO model VALUES (?,?,?,?)',
							data.name,
							data.notes,
							data.picture,
							meta
						)
					);
				});
			}
		}
	}
}
