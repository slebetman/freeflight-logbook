var types = [
	{ name: 'model', type: 'INTEGER' },
	{ name: 'timestamp', type: 'INTEGER' },
	{ name: 'duration', type: 'INTEGER' },
	{ name: 'distance', type: 'INTEGER' },
	{ name: 'distance_unit', type: 'TEXT' },
	{ name: 'windings', type: 'INTEGER' },
	{ name: 'backoff', type: 'INTEGER' },
	{ name: 'torque', type: 'DOUBLE' },
	{ name: 'torque_unit', type: 'TEXT' },
	{ name: 'rubber_length', type: 'TEXT' },
	{ name: 'rubber_length_unit', type: 'TEXT' },
	{ name: 'rubber_width', type: 'TEXT' },
	{ name: 'rubber_width_unit', type: 'TEXT' },
	{ name: 'rubber_weight', type: 'DOUBLE' },
	{ name: 'rubber_weight_unit', type: 'TEXT' },
	{ name: 'location', type: 'TEXT' },
	{ name: 'notes', type: 'TEXT' }
]

var columns = types.map(t => t.name);

var formats = columns.filter(x => !x.match(/_unit$/));

var columnPriority = {};

for (var i=0; i<columns.length; i++) {
	columnPriority[columns[i]] = i;
}

function getValue(data, column) {
	var val = data[column];
	return val === undefined? '' : val;
}

module.exports = function (DB,q,i) {
	
	return {
		name: 'log',
		create: function (ctx) {
			ctx.executeSql(
				'CREATE TABLE IF NOT EXISTS log (' +
					types.map(t => `${t.name} ${t.type}`).join(',') +
				')'
			);
		},
		methods: {
			logColumnDef: function () {
				return columns;
			},
			logFormatDef: function () {
				return formats;
			},
			sortByColumnDef: function (arr) {
				arr.sort((a,b) => {
					return columnPriority[a] - columnPriority[b];
				});
			},
			logs: function (model_id, callback) {
				DB.transaction(function(ctx){
					q(ctx, callback,`
						SELECT
							rowid,
							*
						FROM log
							where model = ?
						`,
						[ model_id ]
					);
				});
			},
			getLogById: function (rowid, callback) {
				DB.transaction(function(ctx){
					q(ctx, row => callback(row[0]),`
						SELECT
							rowid,
							*
						FROM log
							where rowid = ?
						`,
						[ rowid ]
					);
				});
			},
			getLocations: function(callback) {
				DB.transaction(function(ctx){
					q(ctx, function(r){
						callback(r.map(function(x){return x.location}));
					}, `
						SELECT DISTINCT 
							location
						FROM log
						`
					);
				});
			},
			getLogCount: function (callback) {
				DB.transaction(function(ctx){
					q(ctx, callback, `
						SELECT
							model, 
							count(rowid) as logs
						FROM log
						GROUP BY
							model
						`
					);
				});
			},
			deleteLogByModel: function(model_id, callback) {
				DB.transaction(function(ctx){
					q(ctx, callback, `
						DELETE FROM log
						WHERE
							model = ?
						`,
						model_id
					);
				});
			},
			addLog: function (data, callback) {
				var query = 'INSERT INTO log (' + 
						columns.map(c => c).join(',') +
					') VALUES (' + 
						columns.map(() => '?').join(',') +
					')';

				var params = columns.map(c => getValue(data,c));

				DB.transaction(function(ctx){
					i(ctx, callback, query, params);
				});
			},
			saveLog: function (rowid, data, callback) {
				var updates = columns.filter(c => {
					switch (c) {
						case 'model':
						case 'timestamp':
						case 'duration':
						case 'distance':
						case 'distance_unit':
							return false;
						default:
							return true;
					}
				});

				var query = 'UPDATE log SET ' + 
						updates.map(c => c + ' = ?').join(',') +
					' WHERE rowid = ?';

				var params = updates.map(c => getValue(data,c));
				params.push(rowid);

				DB.transaction(function(ctx){
					q(ctx, callback, query, params);
				});
			}
		}
	}
}
