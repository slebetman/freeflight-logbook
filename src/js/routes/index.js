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

        models.forEach(model => {
            $('.content').append(`
                <div data-id="${model.rowid}">
                    <img src="${model.picture}" class="model-thumbnail">
                    <span class="model-name">${model.name}</span>
                </div>
            `); 
        });
    })
}
