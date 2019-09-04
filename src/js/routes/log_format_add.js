var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var camera = require('./lib/camera');
var page = require('../../templates/add_model');

module.exports = function (route, state) {
	console.log('LOG FORMAT ADD CONTROLLER');

	$('.log-format-editor').show();

	onclick('#back', () => history.back());
}