var $ = require('jquery');
var checkSelection = require('./lib/check_selection')('general');
var db = require('../db');
var page = require('../../templates/setting_selection');
var onclick = require('./lib/onclick');

// Settings selection

var choices = {
	unitLength: {
		title: 'Length Units',
		list: ['cm', 'in', 'mm']
	},
	unitWidth: {
		title: 'Width Units',
		list: ['cm', 'in', 'mm']
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
	
	var settingName = state.setting;
	var value = state.selected_setting;
	
	page.setTitle(choices[settingName].title);
	page.drawList(choices[settingName].list);
	
	checkSelection(value);
	
	onclick('#back', function(){
		console.log('back button');
		history.back();
	});
	
	onclick('.selection', function(e){
		var selected = $(e.target).data('setting');
		checkSelection(selected);
		state.selected_setting = selected;
	});
}
