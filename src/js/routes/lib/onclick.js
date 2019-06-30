var $ = require('jquery');

// Click events usually don't fire on mobile.
// So we listen to both click and touchstart.

module.exports = function (selector, callback) {
	var prevScroll = 0;

	$(selector).on('touchstart', function(e){
		prevScroll = $(e.target).offset().top;
	});

	$(selector).on('touchend', function(e){
		var scroll = (e.target).offset().top;

		console.log('scroll', prevScroll, scroll);

		if (Math.abs(scroll - prevScroll) < 5) {
			callback(e);
		}
	});

	$(selector).on('click', callback);
}