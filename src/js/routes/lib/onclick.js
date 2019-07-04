var $ = require('jquery');

// Click events usually don't fire on mobile.
// So we listen to both click and touchstart.

module.exports = function (selector, callback) {
	var clicking = false;
	
	$(selector).on('touchstart', function(e){
		clicking = true;
	});

	$(selector).on('touchmove', function(e){
		clicking = false;
	});
	
	$(selector).on('touchend', function(e){
		if (clicking) {
			clicking = false;
			callback(e);
		}
	});
}