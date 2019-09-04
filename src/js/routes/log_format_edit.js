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
	$('.log-format-editor').hide();

	db.getFormatById(rowid, f => {
		console.log(f);

		$('input[name="name"]').val(state.selected_log_format_name);
		if (rowid <=3) {
			$('.toggle').hide();
			$('.settings-check').show();
			$('input').prop('readonly', 'readonly');
			$('.control-item.distance').hide();
		}
		f.fields.forEach(field => {
			$('.' + field).addClass('active');
			$('.' + field + ' span.icon').addClass('icon-check');
			switch (field) {
				case 'duration':
					$('.distance').removeClass('active');
					break;
				case 'distance':
					$('.duration').removeClass('active');
					break;
			}
		});
		$('.log-format-editor').show();
	})

	onclick('#back', () => history.back());
}