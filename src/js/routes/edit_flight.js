var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var common = require('./lib/flight_common');
var moment = require('moment');
var format = require('./lib/format');
var page = require('../../templates/edit_flight');

module.exports = function (route, state) {
	console.log('FLIGHT LOG');

	console.log(state);

	var model = state.selected_model;
	var flightId = state.selected_flight;

	common.registerLocationAutosuggest();
	common.showFields(model);

	db.getLogById(flightId, flight => {
		console.log(flight);

		$('#timestamp').text(format.timestamp(flight.timestamp));
		$('#duration').text(format.duration(flight.duration));
		$('#flight-info').show();

		(function(){
			var settingname = state.setting;
			var settingvalue = state.selected_setting;
			state.setting = undefined;
			state.selected_setting = undefined;

			common.updateValues(flight, true);
			common.updateUnits(common.mapUnits(flight), settingname, settingvalue);
	
			if (settingname && settingvalue) {
				$(common.map[settingname]).text(settingvalue);
			}
		})();

		common.registerUnitSelection(state);
	});

	onclick('#save-flight',() => {
		var formData = page.getValues();
		console.log(JSON.stringify(formData,null,2));

		db.saveLog(flightId, formData, () => {
			state.push({
				url: 'model.html'
			});
		})
	})
}