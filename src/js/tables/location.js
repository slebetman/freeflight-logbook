var brick = require('brick');

module.exports = function (DB,q,i) {
	
	return {
		name: 'location',
		create: function (ctx) {
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS location (
				name TEXT,
				notes TEXT,
				picture TEXT
			)`);
		},
		methods: {
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
			}
		}
	}
}

