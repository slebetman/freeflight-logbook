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

        $('.content').append(`
            <pre>${JSON.stringify(models,null,2)}</pre>
        `);
    })
}
