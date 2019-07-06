var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var camera = require('./lib/camera');
var page = require('../../templates/add_model');

module.exports = function (route, state) {
	console.log('LOG FORMAT EDIT CONTROLLER',
		state.selected_log_format,
		state.selected_log_format_name
	);

	var rowid = state.selected_log_format;
	$('.content').hide();

	db.getFormatById(rowid, f => {
		console.log(f);

		$('input[name="name"]').val(state.selected_log_format_name);
		f.fields.forEach(field => {
			$('.' + field).addClass('active');
			switch (field) {
				case 'duration':
					$('.distance').removeClass('active');
					break;
				case 'distance':
					$('.duration').removeClass('active');
					break;
			}
		});
		$('.content').show();
	})

	onclick('#back', () => history.back());
}