var $ = require('jquery');

module.exports = function (route, state) {
	$('#back').click(function(){
		state.push({url: state.previousPage, transition: 'slide-out'});
	});
}
