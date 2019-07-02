var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var moment = require('moment');
var page = require('../../templates/model');

module.exports = function (route, state) {
	console.log('FLIGHT LOG');

	console.log(state);

	var model = state.selected_model;

	function loadLogs (callback) {
		db.logs(model.rowid, function(logs){
			var fields = model.meta.fields;
			logs.reverse();

			console.log('logs=',logs);
			console.log('fields=',fields);

			var logTable = $('<table/>');
			var logHeaders = $('<tr class="header"/>');
			logHeaders.append(fields.map(function(f){
				f = f.replace(/_/g,'-')
					.replace('windings', 'winds')
					.replace('length', 'len')
					.replace('weight', 'wt')
					.replace('rubber', 'r');

				return $('<th/>').text(f) 
			}));

			logTable.append(logHeaders);
			logs.forEach(function(row){
				var logData = $('<tr/>');

				fields.forEach(function(f){
					var val = row[f];
					if (val != '') {
						switch (f) {
							case 'duration':
								val = moment.utc(val).format('mm:ss.SSS');
								break;
							case 'rubber_length':
								val += ` <span class="unit">${row.rubber_length_unit}</span>`;
								break;
							case 'rubber_width':
								val += ` <span class="unit">${row.rubber_width_unit}</span>`;
								break;
							case 'rubber_weight':
								val += ` <span class="unit">${row.rubber_weight_unit}</span>`;
								break;
							case 'torque':
								val += ` <span class="unit">${row.torque_unit}</span>`;
								break;
						}
					}

					console.log('field ',f,val);
					logData.append($('<td/>').html(val));
				});
				logTable.append(logData);
			});

			$('.flight-log').html(logTable);

			if (callback) callback(logTable);
		});
	}

	if (state.saved_timer && state.selected_model.flight) {
		var flight = state.selected_model.flight;

		flight.duration = state.saved_timer;
		flight.timestamp = moment.now();
		state.saved_timer = undefined;

		for (var k in flight) {
			if (flight[k] === undefined) {
				flight[k] = '';
			}
		}
		
		if (flight.rubber_width_unit === 'in') {
			var w = flight.rubber_width;
			w = w.trim();
			if (w.match(/^\d\d+$/)) {
				w = '0.' + w;
			}
			if (w.match(/^\.\d+$/)) {
				w = '0' + w;
			}
			w.replace(/ /g,'');
			// Replace common fractions:
			switch (w) {
				case '0.5': w = '1/2'; break;
				case '0.25': w = '1/4'; break;
				case '0.125': w = '1/8'; break;
				case '0.0625': w = '1/16'; break;
				case '0.03125': w = '1/32'; break;
				case '0.015625': w = '1/64'; break;
			}
			flight.rubber_width = w;
		}

		console.log('logged time=',moment.utc(flight.duration).format('mm:ss.SSS'));
		console.log(JSON.stringify(flight,null,2));

		db.addLog(flight, function(){
			console.log('saved log');
			loadLogs(function(table){
				var added = $(table.find('tr')[1]);

				var c = 1;

				function fade () {
					c += 2;
					added.css('background-color',`rgb(255,255,${c})`);
					if (c < 255) {
						setTimeout(fade,10);
					}
				}

				fade();
			});
		});
	}
	else {
		loadLogs();
	}

	$('.title').text(model.name);

	onclick('#back',function(){
		console.log('back');
		state.push({
			url: 'index.html',
			transition:'slide-out'
		});
	})
}