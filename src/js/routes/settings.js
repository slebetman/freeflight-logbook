var $ = require('jquery');
var db = require('../db');
var page = require('../../templates/settings');
var onclick = require('./lib/onclick');

module.exports = function (route, state) {
	console.log('SETTINGS CONTROLLER');

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
	
	onclick('.setting_link', function(){
		state.setting = $(this).data('settingname');
		console.log('setting='+state.setting);
	});
	
	onclick('#back', function(){
		window.history.back();
	});
}
