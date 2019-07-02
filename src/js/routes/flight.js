var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var page = require('../../templates/flight');

var map = {
	unitLength: 'span.rubber_length_unit',
	unitWidth: 'span.rubber_width_unit',
	unitWeight: 'span.rubber_weight_unit',
	unitTorque: 'span.torque_unit'
}

var unitMap = {
	rubber_length_unit: 'unitLength',
	rubber_width_unit: 'unitWidth',
	rubber_weight_unit: 'unitWeight',
	torque_unit: 'unitTorque'
}

function mapUnits (data) {
	var ret = {};
	for (var k in unitMap) {
		ret[unitMap[k]] = data[k];
	}
	return ret;
}

function updateValues (data) {
	[
		'location',
		'rubber_length',
		'rubber_width',
		'rubber_weight'

	].forEach(function(key){
		$(`input[name="${key}"]`).val(data[key]);
	});
}

function updateUnits (data, settingname, settingvalue) {
	console.log('updateUnits',data, settingname, settingvalue);

	[
		'unitLength',
		'unitWidth',
		'unitWeight',
		'unitTorque'

	].forEach(function(key){
		var datakey = key;
		if (key == 'unitWidth') {
			datakey = 'unitLength';
		}
		if (!settingvalue || settingname !== key) {
			$(map[key]).text(data[datakey]);
		}
	})
}

module.exports = function (route, state) {
	console.log('NEW FLIGHT');

	var model = state.selected_model;

	console.log('model', model);

	state.previousPage = route.pathname;
	
	db.getLocations(function(loc){
		console.log('locations=',loc);
	});
	
	(function(){
		var settingname = state.setting;
		var settingvalue = state.selected_setting;
		state.setting = undefined;
		state.selected_setting = undefined;

		if (model.flight) {
			updateValues(model.flight);
			updateUnits(mapUnits(model.flight), settingname, settingvalue);
		}
		else {
			db.settings(settings => {
				updateUnits(settings, settingname, settingvalue);
			});
		}

		if (settingname && settingvalue) {
			$(map[settingname]).text(settingvalue);
		}
	})();

	model.meta.fields.forEach(function(f){
		$(`li.table-view-cell.${f}`).show();
	});

	onclick('.setting_link', function(e){
		var target = $(e.target);
		state.setting = target.data('settingname');
		state.selected_setting = target.find('span.settings-text').text();
		console.log('setting='+state.setting);
	});

	onclick('#start-flight',function(){
		var formData = page.getValues();
		console.log(formData);

		// data.model,
		// data.timestamp,
		// data.duration,
		// data.distance,
		// data.distance_unit,
		// data.location,
		// data.windings,
		// data.backoff,
		// data.torque,
		// data.torque_unit,
		// data.rubber_length,
		// data.rubber_length_unit,
		// data.rubber_width,
		// data.rubber_width_unit,
		// data.notes
		
		formData.model = model.rowid;

		state.selected_model.flight = formData;

		console.log(state);
	})
}
