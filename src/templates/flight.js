// Viewmodel for flight page
var $ = require('jquery');
var onclick = require('../js/routes/lib/onclick');

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

module.exports = {
	getValues: function () {
		return {
            windings: $('input[name="windings"]').val(),
            backoff: $('input[name="backoff"]').val(),
            torque: $('input[name="torque"]').val(),
            rubber_length: $('input[name="rubber_length"]').val(),
            rubber_width: $('input[name="rubber_width"]').val(),
            notes: $('textarea[name="notes"]').val(),
            rubber_length_unit: $('span.rubber_length_unit').text(),
            rubber_width_unit: $('span.rubber_width_unit').text(),
            rubber_weight_unit: $('span.rubber_weight_unit').text(),
            torque_unit: $('span.torque_unit').text()
		}
	}
}