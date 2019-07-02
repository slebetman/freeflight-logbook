function parallel (jobs, callback) {
	var count = jobs.length;
	var result = [];

	for (var i=0; i<jobs.length; i++) {
		(j => {
			jobs[j](r => {
				result[j] = r;
				count--;

				if (count == 0) {
					callback(result);
				}
			});
		})(i);
	}
}

module.exports = parallel;