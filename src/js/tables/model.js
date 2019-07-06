function unpackMeta (callback) {
	return function (results) {
		var rows = [].slice.call(results);
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
						'SELECT rowid, * FROM model'
					);
				});
			},
			addModel: function (data, callback) {
				DB.transaction(function(ctx){
					var meta = JSON.stringify(data.meta) || "{}";
					i(ctx, callback,
						'INSERT INTO model VALUES (?,?,?,?)',
						[
							data.name,
							data.notes,
							data.picture,
							meta
						]
					);
				});
			},
			saveModel: function (id, data, callback) {
				DB.transaction(function(ctx){
					var meta = JSON.stringify(data.meta) || "{}";
					q(ctx, callback,
						`
							UPDATE model
							SET
								name = ?,
								notes = ?,
								picture = ?,
								meta = ?
							WHERE
								rowid = ?
						`,
						[
							data.name,
							data.notes,
							data.picture,
							meta,
							id
						]
					);
				});
			},
			deleteModelById: function (id, callback) {
				DB.transaction(function(ctx){
					q(ctx,callback,
						'DELETE FROM model where rowid = ?',
						[ id ]
					);
				});
			}
		}
	}
}
