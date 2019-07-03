var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var common = require('./lib/flight_common');
var page = require('../../templates/flight');

module.exports = function (route, state) {
	console.log('NEW FLIGHT');

	var model = state.selected_model;

	console.log('model', model);

	state.previousPage = route.pathname;
	
	common.registerLocationAutosuggest();
	common.showFields(model);
	
	(function(){
		var settingname = state.setting;
		var settingvalue = state.selected_setting;
		state.setting = undefined;
		state.selected_setting = undefined;

		if (model.flight) {
			common.updateValues(model.flight);
			common.updateUnits(common.mapUnits(model.flight), settingname, settingvalue);
		}
		else {
			db.settings(settings => {
				common.updateUnits(settings, settingname, settingvalue);
			});
		}

		if (settingname && settingvalue) {
			$(common.map[settingname]).text(settingvalue);
		}
	})();

	common.registerUnitSelection(state);

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
