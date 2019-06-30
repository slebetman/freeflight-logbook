var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
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
	
	onclick('.setting_link', function(e){
		state.setting = $(e.target).data('settingname');
		console.log('setting='+state.setting);
	});
	
	onclick('#back', function(){
		history.back();
	});

	onclick('#reset-db',function(){
		navigator.notification.confirm(
			'Are you sure you want to delete all your data? ' +
			'This action cannot be undone!',
			function(choice) {
				console.log('choice', choice);
				if (choice == 1) {
					db.clear(function(){
						console.log('cleared');
						db.init(function(){
							alert.info('Database cleared.',function(){});
						});
					});
				}
			},
			'WARNING!'
		);
	});
}
