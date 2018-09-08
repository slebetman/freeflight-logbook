var brick = require('brick');
var formats = require('./lib/built_in_log_formats.json');
var flatten = require('./lib/flatten');

module.exports = function (DB,q,i) {
	
	function initLogFormat (ctx) {
		formats.forEach(function(f){
			var q = brick('INSERT INTO log_format VALUES (?,?)',
				f.name,
				JSON.stringify(f.meta)
			).build();
			console.log(q.text);
			ctx.executeSql(q.text,q.params);
		});
	}
	
	function unpackLogFormat (callback) {
		return function (result) {
			var ret = [];
			for (var i=0; i<result.length; i++) {
				ret.push({
					rowid: result[i].rowid,
					name: result[i].name,
					meta: JSON.parse(result[i].meta)
				});
			}
			callback(ret);
		}
	}
	
	return {
		create: function (ctx) {
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS log_format (
				name TEXT,
				meta TEXT
			)`,[],function(ctx, result){
				console.log('created log_format');
				ctx.executeSql('SELECT count(rowid) as c from log_format',[],
					function(ctx, result) {
						console.log(result);
						if (result.rows[0].c <= 0) {
							console.log('Initialize LogFormat')
							initLogFormat(ctx);
						}
					}
				);
			});
		},
		methods: {
			log_formats: function (callback) {
				DB.transaction(function(ctx){
					q(ctx,unpackLogFormat(callback),
						'SELECT rowid, * FROM log_format'
					);
				});
			},
			getFormatName: function (rowid, callback) {
				DB.transaction(function(ctx){
					q(ctx,flatten('name',callback),
						brick('SELECT name FROM log_format where rowid = ?',rowid)
					);
				});
			}
		}
	}
}