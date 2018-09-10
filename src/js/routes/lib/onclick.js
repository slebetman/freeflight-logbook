var $ = require('jquery');

// Click events usually don't fire on mobile.
// So we listen to both click and touchstart.

module.exports = function (selector, callback) {
	$(selector).on('click touchstart', callback);
}