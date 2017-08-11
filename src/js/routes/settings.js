var $ = require('jquery');

var formats = [
	'Simple',
	'Glider',
	'FAI Competition'
];

module.exports = function (route, state) {
	if (typeof state.selected_log_format == 'undefined') {
		state.selected_log_format = 0;
	}

	state.previousPage = route.pathname;
	
	$('.log-format').html(formats[state.selected_log_format]);
}
