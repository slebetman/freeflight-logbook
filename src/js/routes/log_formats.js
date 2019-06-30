var $ = require('jquery');
var checkSelection = require('./lib/check_selection')('log');
var db = require('../db');
var page = require('../../templates/log_formats');
var onclick = require('./lib/onclick');

function loadSelectedFormat (from, state, callback) {
	db.getSetting('defaultFormat', defaultFormat => {
		switch (from) {
			case '/settings':
				callback(defaultFormat);
				break;
			case '/add_model':
				if (typeof state.selected_log_format == 'undefined') {
					state.selected_log_format = defaultFormat;
					callback(defaultFormat);
				}
				else {
					// Load temporarily selected format
					// because we have not saved the model yet
					callback(state.selected_log_format);
				}
				break;
			default:
				console.error('Unsupported "from" ' + from);
				callback();
		}
	});
}

function saveSelectedFormat (selected, from, state, callback) {	
	console.log(selected);
	
	switch (from) {
		case '/settings':
			db.setSetting('defaultFormat',selected.toString(),callback);
			break;
		case '/add_model':
			state.selected_log_format = selected;
			callback();
			break;
		default:
			console.error('Unsupported "from" ' + from);
			callback();
	}
}

module.exports = function (route, state) {
	console.log('loading log_format code');
	
	var from = state.previousPage
		.replace(/.html$/,'')
		.replace(/.*\//,'/');
		
	console.log('previous='+from);
	
	db.log_formats(formats => {
	
		page.drawList(formats);
	
		loadSelectedFormat(from, state, selectedFormat => {
			checkSelection(selectedFormat);
			
			onclick('#back', function(){
				console.log('back button');
				history.back();
			});
			
			onclick('.selection', function(e){
				var selected = $(e.target).data('format');
				saveSelectedFormat(selected, from, state, function(){
					checkSelection(selected);
				});
			});
		});
	})
}
