var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var page = require('../../templates/index');
var format = require('./lib/format');
var moment = require('moment');

module.exports = function (route, state) {
	console.log('TIMER');

	var start = null;
	var paused = null;
	var running = null;
	
	onclick('.content', function(){
		if (!running) {
			$('#timer-instruction').hide();
			$('#timer-buttons').hide();
			if (!start) {
				start = moment();
			}
			else if (paused) {
				var diff = paused.diff(start);
				start = moment().subtract(diff);
			}

			running = setInterval(function(){
				var elapsed = moment().diff(start);
				$('#timer').text(format.duration(elapsed));
			},10);
		}
		else {
			$('#timer-buttons').show();
			$('.timer-button').show();
			$('#timer-instruction').text('PAUSED - click anywhere to resume').show();
			clearInterval(running);
			paused = moment();
			running = null;
		}
	});

	onclick('#reset',function(){
		start = null;
		paused = null;
		running = null;
		$('#timer').text('00:00.00');
	});

	onclick('#save',function(){
		state.saved_timer = paused.diff(start);
	});
}
