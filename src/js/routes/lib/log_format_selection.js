var $ = require('jquery');

function checkSelection (format_id) {
	$('.selection span.icon').removeClass('icon-check');
	$('.selection[data-format="' + format_id + '"] span.icon').addClass('icon-check');
}

module.exports = checkSelection;