var flatten = require('./lib/flatten');

var settings = [
	{
		name: 'defaultFormat',
		value: '1'
	},
	{
		name: 'unitLength',
		value: 'in'
	},
	{
		name: 'unitWeight',
		value: 'g'
	},
	{
		name: 'unitTorque',
		value: 'g cm'
	}
];

module.exports = function (DB,q,i) {
	
	function initSettings (ctx) {
		settings.forEach(function(f){
			var query = 'INSERT INTO settings VALUES (?,?)';
			var params = [
				f.name,
				f.value
			];
			ctx.executeSql(query,params);
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
		name: 'settings',
		create: function (ctx) {
			ctx.executeSql(`CREATE TABLE IF NOT EXISTS settings (
				name TEXT,
				value TEXT
			)`,[],function(ctx, result){
				console.log('created settings');
				ctx.executeSql('SELECT count(rowid) as c from settings',[],
					function(ctx, result) {
						console.log(JSON.stringify(result.rows.item(0),null,2));
						if (result.rows.item(0).c <= 0) {
							console.log('Initialize Settings')
							initSettings(ctx);
						}
					},
					function(err){
						console.error('SELECT ERROR settings: ' + err.message);
						return false;
					}
				);
			},function(err){
				console.error(err.message);
				return false;
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
						'SELECT value FROM settings WHERE name = ?',
						[ name ]
					);
				});
			},
			setSetting: function (name, value,callback) {
				DB.transaction(function(ctx){
					q(ctx,callback,
						'UPDATE settings SET value = ? WHERE name = ?',
						[
							value,
							name
						]
					);
				});
			}
		}
	}
}
