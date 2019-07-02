var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var page = require('../../templates/index');


module.exports = function (route, state) {
	console.log('LANDING PAGE');

	if (typeof state.selected_log_format == 'undefined') {
		state.selected_log_format = 0;
	}

	state.previousPage = route.pathname;
	
	console.log(state);
	
	db.models(function(models){
		console.log('got models', models);
		var rows = [];

		models.forEach(model => {
			rows.push(`
				<div class="model-row" data-id="${model.rowid}">
					<img src="${model.picture}" class="model-thumbnail">
					<div class="model-info">
						<div class="model-name">${model.name}</div>
						<div class="model-notes">${model.notes}</div>
					</div>
				</div>
			`); 
		});

		$('.content').html(rows);

		onclick('.content',function(e){
			var target = $(e.target);

			if (!target.hasClass('model-row')) {
				var target = target.closest('.model-row');
			}

			if (target.hasClass('model-row')) {
				var id = target.data('id');
				console.log('clicked', id);
				state.selected_model = models.filter(x=>x.rowid==id)[0];

				console.log('leaving state',state);

				state.push({url:'model.html'});
			}
		})
	});
}
