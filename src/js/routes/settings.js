var $ = require('jquery');
var db = require('../db');
var page = require('../../templates/settings');

module.exports = function (route, state) {
	if (typeof state.selected_log_format == 'undefined') {
		state.selected_log_format = 0;
	}

	state.previousPage = route.pathname;
	
	db.settings(settings => {
		db.getFormatName(settings.defaultFormat, name => {
			$('.log-format').html(name);
		});
		$('.unit-length').html(settings.unitLength);
		$('.unit-weight').html(settings.unitWeight);
		$('.unit-torque').html(settings.unitTorque);
	});
}
