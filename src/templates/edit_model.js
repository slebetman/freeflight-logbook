// Viewmodel for add_model page
var $ = require('jquery');
var onclick = require('../js/routes/lib/onclick');

module.exports = {
	handleSaveButton: function (callback) {
		onclick('#save-model',callback);
	},
	handlePictureUpload: function (callback) {
		onclick('.click-instruction',callback);
		onclick('.plane-pic',callback);
	},
	getValues: function () {
		return {
			name: $('input[name="name"]').val(),
			notes: $('textarea[name="notes"]').val(),
			picture: $('.plane-pic').attr('src')
		}
	},
	setValues: function (model) {
		console.log('setValues',model);

		$('input[name="name"]').val(model.name);
		$('textarea[name="notes"]').val(model.notes);
		$('.plane-pic').attr('src',model.picture);
	}
}
