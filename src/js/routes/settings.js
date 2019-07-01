var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var page = require('../../templates/settings');
var onclick = require('./lib/onclick');

var map = {
	unitLength: '.unit-length',
	unitWeight: '.unit-weight',
	unitTorque: '.unit-torque'
}

module.exports = function (route, state) {
	console.log('SETTINGS CONTROLLER');

	if (typeof state.selected_log_format == 'undefined') {
		state.selected_log_format = 0;
	}

	state.previousPage = route.pathname;
	
	(function(){
		var settingname = state.setting;
		var settingvalue = state.selected_setting;

		db.settings(settings => {
			db.getFormatName(settings.defaultFormat, name => {
				$('.log-format').html(name);
			});

			if (!settingvalue || settingname !== 'unitLength') {
				$('.unit-length').html(settings.unitLength);
			}
			if (!settingvalue || settingname !== 'unitWeight') {
				$('.unit-weight').html(settings.unitWeight);
			}
			if (!settingvalue || settingname !== 'unitTorque') {
				$('.unit-torque').html(settings.unitTorque);
			}
		});
	})();

	// Save setting if we're returning from setting_selection
	if (state.selected_setting && state.setting) {
		(function(){
			var settingname = state.setting;
			var settingvalue = state.selected_setting;
			state.selected_setting = undefined;
			state.setting = undefined;

			db.setSetting(settingname, settingvalue, function(){
				$(map[settingname]).html(settingvalue);
			});
		})();
	}
	
	onclick('.setting_link', function(e){
		var target = $(e.target);
		state.setting = target.data('settingname');
		state.selected_setting = target.find('span.settings-text').text();
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
