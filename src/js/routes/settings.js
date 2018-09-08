var $ = require('jquery');
var db = require('../db');

module.exports = function (route, state) {
	if (typeof state.selected_log_format == 'undefined') {
		state.selected_log_format = 0;
	}

	state.previousPage = route.pathname;
	
	db.getSetting('defaultFormat', result => {
		var selected = parseInt(result[0].value);
		
		db.log_formats(formats => {
			var formatName = formats
				.filter(x => x.rowid == selected)[0]
				.name;
			
			$('.log-format').html(formatName);
		});
	});
}
