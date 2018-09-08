function flatten (column, callback) {
	return function (result) {
		callback(result[0][column]);
	}
}

module.exports = flatten;