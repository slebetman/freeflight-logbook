var $ = require('jquery');
var checkSelection = require('./lib/check_selection')('general');
var db = require('../db');
var page = require('../../templates/setting_selection');

// Settings selection

var choices = {
	unitLength: {
		title: 'Length Units',
		list: ['cm', 'in']
	},
	unitWeight:  {
		title: 'Weight Units',
		list: ['g','lb']
	},
	unitTorque:  {
		title: 'Torque Units',
		list: ['g cm', 'lb in', 'g in']
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
		
		$('#back').click(function(){
			console.log('back button');
			state.push({url: state.previousPage, transition: 'slide-out'});
		});
		
		$('.selection').click(function(){
			var selected = $(this).data('setting');
			db.setSetting(settingName, selected, function(){
				checkSelection(selected);
			});
		});
	});
}
