const moment = require('moment');

function duration (t,msDigits) {
	var ms = 'SSS'
	if (msDigits !== undefined) {
		ms = 'S'.repeat(msDigits);
	}
	return moment.utc(t).format('mm:ss.' + ms);
}

function timestamp (t) {
	return moment(t).format('D MMM YYYY h:mm:ss a');
}

module.exports = {
	duration,
	timestamp
}