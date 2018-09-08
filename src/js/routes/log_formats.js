var $ = require('jquery');
var checkSelection = require('./lib/log_format_selection');
var db = require('../db');
var page = require('../../templates/log_formats');

function loadSelectedFormat (from, state, callback) {
	db.getSetting('defaultFormat', result => {
		var defaultFormat = result[0].value;
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

function saveSelectedFormat (from, state, callback) {
	var selected = $(this).data('format');
	
	switch (from) {
		case '/settings':
			db.setSetting('defaultFormat',selected,callback);
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
			
			$('#back').click(function(){
				console.log('back button');
				state.push({url: state.previousPage, transition: 'slide-out'});
			});
			
			$('.selection').click(function(){
				saveSelectedFormat(from, state, function(){
					checkSelection(state.selected_log_format);
				});
			});
		});
	})
}
