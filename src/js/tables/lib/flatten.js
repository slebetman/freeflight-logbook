function flatten (column, callback) {
	return function (result) {
		callback(result.item(0)[column]);
	}
}

module.exports = flatten;