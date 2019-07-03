var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var camera = require('./lib/camera');
var page = require('../../templates/edit_model');

module.exports = function (route, state) {
	console.log('EDIT MODEL CONTROLLER');

	if (typeof state.selected_log_format == 'undefined') {
		state.selected_log_format = 0;
	}

	state.previousPage = route.pathname;
	
	console.log(state);
	
	var model = state.selected_model;

	$('.title').text(model.name);
	$('.log-format').text(state.selected_log_format_name || model.meta.format);
	page.setValues(model);

	function goBack (transition) {
		state.selected_log_format = undefined;
		var target = {
			url:'model.html'
		};
		if (transition) {
			target.transition = 'slide-out';
		}
		state.push(target);
	}
	
	onclick('#back', function(e){
		console.log('back button');
		goBack(true);
	});
	
	page.handlePictureUpload(function(){
		camera.getPicture(function(img){
			var url = 'data:image/jpeg;base64,' + img;
			console.log('image size=',url.length);
			$('.plane-pic').attr('src', url);
			$('.click-instruction').hide();
		});
	});
	
	page.handleSaveButton(function(){
		console.log('save model');

		var formData = page.getValues();
		console.log('log format=',state.selected_log_format);

		if (formData.name == "") {
			alert.error('Please enter model name');
		}
		else {
			db.getFormatById(state.selected_log_format, function(format) {
				console.log('format=',format);

				formData.meta = {
					fields: format.fields,
					format: state.selected_log_format_name
				};
	
				console.log('model=',formData);

				db.saveModel(model.rowid, formData, function(){
					goBack();
				});
			});
		}
	});
}
