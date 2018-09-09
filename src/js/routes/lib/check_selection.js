var $ = require('jquery');

var types = {
	log_format: function(item) {
		return '.selection[data-format="' + item + '"] span.icon'
	},
	general: function(item) {
		return '.selection[data-setting="' + item + '"] span.icon'
	},
}

module.exports = function (type) {

	function checkSelection (item) {
		$('.selection span.icon').removeClass('icon-check');
		$(types[type](item)).addClass('icon-check');
	}
	
	return checkSelection;
}
