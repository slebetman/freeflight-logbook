const lz = require('lz-string');

function unpackMeta (callback) {
	return function (results) {
		var rows = [].slice.call(results);
		callback(rows.map(x => {
			x.meta = JSON.parse(x.meta);
			return x;
		}));
	}
}

function decompressPicture (callback) {
	return function (results) {
		callback(results.map(x => {
			if (x.picture.match(/^lz:/)) {
				x.picture = lz.decompressFromUTF16(x.picture.substr(3));
			}
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
					q(ctx,decompressPicture(unpackMeta(callback)),
						'SELECT rowid, * FROM model'
					);
				});
			},
			addModel: function (data, callback) {
				console.log('picture size=',data.picture.length);

				if (data.picture.length > 100) {
					data.picture = 'lz:' + lz.compressToUTF16(data.picture);
					console.log('compressed picture size =', data.picture.length);
				}

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
				console.log('picture size=',data.picture.length);

				if (data.picture.length > 100) {
					data.picture = 'lz:' + lz.compressToUTF16(data.picture);
					console.log('compressed picture size =', data.picture.length);
				}

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
