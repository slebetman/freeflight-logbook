var $ = require('jquery');
var db = require('../db');
var onclick = require('./lib/onclick');

module.exports = function (route, state) {
	console.log('ADD MODEL CONTROLLER');

	if (typeof state.selected_log_format == 'undefined') {
		state.selected_log_format = 0;
	}

	state.previousPage = route.pathname;
	
	console.log(state);
	
	db.getSetting('defaultFormat', defaultFormat => {
		if (!state.selected_log_format) {
			state.selected_log_format = defaultFormat;
		}
	
		db.getFormatName(state.selected_log_format, name => {
			$('.log-format').html(name);
		});
	});
	
	onclick('#back', function(){
		console.log('back button');
		state.selected_log_format = undefined;
	});
}
