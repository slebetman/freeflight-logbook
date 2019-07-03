// Viewmodel for flight page
var $ = require('jquery');
var onclick = require('../js/routes/lib/onclick');

module.exports = {
	getValues: function () {
		return {
			location: $('input[name="location"]').val(),
			windings: $('input[name="windings"]').val(),
			backoff: $('input[name="backoff"]').val(),
			torque: $('input[name="torque"]').val(),
			rubber_length: $('input[name="rubber_length"]').val(),
			rubber_width: $('input[name="rubber_width"]').val(),
			rubber_length_unit: $('span.rubber_length_unit').text(),
			rubber_width_unit: $('span.rubber_width_unit').text(),
			rubber_weight_unit: $('span.rubber_weight_unit').text(),
			torque_unit: $('span.torque_unit').text(),
			torque_unit: $('span.torque_unit').text(),
			notes: $('textarea[name="notes"]').val()
		}
	}
}