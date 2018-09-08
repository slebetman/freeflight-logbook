var brick = require('brick');
var flatten = require('./lib/flatten');

var settings = [
	{
		name: 'defaultFormat',
		value: '1'
	},
	{
		name: 'unitLength',
		value: 'inch'
	},
	{
		name: 'unitWeight',
		value: 'grams'
	},
	{
		name: 'unitTorque',
		value: 'grams cm'
	}
];

module.exports = function (DB,q,i) {
	
	function initSettings (ctx) {
		settings.forEach(function(f){
			var q = brick('INSERT INTO settings VALUES (?,?)',
				f.name,
				f.value
			).build();
			console.log(q.text);
			ctx.executeSql(q.text,q.params);
		});
	}
	
	function formatSettings (callback) {
		return function (result) {
			var ret = {};
			for (i=0; i<result.length; i++) {
				ret[result[i].name] = result[i].value;
			}
			callback(ret);
		}
	}
	
	return {
		create: function (ctx) {
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS settings (
				name TEXT,
				value TEXT
			)`,[],function(ctx, result){
				console.log('created settings');
				ctx.executeSql('SELECT count(rowid) as c from settings',[],
					function(ctx, result) {
						console.log(result);
						if (result.rows[0].c <= 0) {
							console.log('Initialize Settings')
							initSettings(ctx);
						}
					}
				);
			});
		},
		methods: {
			settings: function (callback) {
				DB.transaction(function(ctx){
					q(ctx,formatSettings(callback),
						'SELECT rowid, * FROM settings'
					);
				});
			},
			getSetting: function (name,callback) {
				DB.transaction(function(ctx){
					q(ctx,flatten('value',callback),
						brick('SELECT value FROM settings WHERE name = ?',name)
					);
				});
			},
			setSetting: function (name, value,callback) {
				DB.transaction(function(ctx){
					q(ctx,callback,
						brick('UPDATE settings SET value = ? WHERE name = ?',
							value,name
						)
					);
				});
			}
		}
	}
}
