var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var camera = require('./lib/camera');
var page = require('../../templates/add_model');

module.exports = function (route, state) {
	console.log('ADD MODEL CONTROLLER');

	if (typeof state.selected_log_format == 'undefined') {
		state.selected_log_format = 0;
	}

	state.previousPage = route.pathname;
	
	console.log(state);
	
	db.getSetting('defaultFormat', defaultFormat => {
		if (!state.selected_log_format) {
			state.selected_log_format = defaultFormat;
		}
	
		db.getFormatName(state.selected_log_format, name => {
			$('.log-format').text(name);
		});
	});

	function goBack (transition) {
		state.selected_log_format = undefined;
		var target = {
			url:'index.html'
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

		var model = page.getValues();
		console.log('log format=',state.selected_log_format);

		if (model.name == "") {
			alert.error('Please enter model name');
		}
		else {
			db.getFormatById(state.selected_log_format, function(format) {
				console.log('format=',format);

				model.meta = {
					fields: format.fields
				};
	
				console.log('model=',model);

				db.addModel(model,function(){
					goBack();
				});
			});
		}
	});
}
