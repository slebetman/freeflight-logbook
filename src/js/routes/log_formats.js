var $ = require('jquery');
var checkSelection = require('./lib/log_format_selection');

module.exports = function (route, state) {
	console.log('loading log_format code');
	
	if (typeof state.selected_log_format == 'undefined') {
		state.selected_log_format = 0;
	}
	
	checkSelection(state.selected_log_format);
	
	$('#back').click(function(){
		console.log('back button');
		state.push({url: state.previousPage, transition: 'slide-out'});
	});
	
	$('.selection').click(function(){
		state.selected_log_format = parseInt($(this).data('format'),10);
		checkSelection(state.selected_log_format);
	});
}
