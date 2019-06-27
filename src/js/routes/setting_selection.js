var $ = require('jquery');
var checkSelection = require('./lib/check_selection')('general');
var db = require('../db');
var page = require('../../templates/setting_selection');
var onclick = require('./lib/onclick');

// Settings selection

var choices = {
	unitLength: {
		title: 'Length Units',
		list: ['cm', 'in', 'm']
	},
	unitWeight:  {
		title: 'Weight Units',
		list: ['g','oz','lb']
	},
	unitTorque:  {
		title: 'Torque Units',
		list: ['g cm', 'oz in', 'lb in']
	}
}

module.exports = function (route, state) {
	console.log('loading setting');
	
	console.log(state);
	
	var settingName = state.setting;;
	
	page.setTitle(choices[settingName].title);
	page.drawList(choices[settingName].list);
	
	db.getSetting(settingName, value => {
		checkSelection(value);
		
		onclick('#back', function(){
			console.log('back button');
			history.back();
		});
		
		onclick('.selection', function(){
			var selected = $(this).data('setting');
			db.setSetting(settingName, selected, function(){
				checkSelection(selected);
			});
		});
	});
}
