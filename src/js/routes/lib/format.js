const moment = require('moment');

function duration (t) {
	return moment.utc(t).format('mm:ss.SSS');
}

function timestamp (t) {
	return moment(t).format('D MMM YYYY h:mm:ss a');
}

module.exports = {
	duration,
	timestamp
}