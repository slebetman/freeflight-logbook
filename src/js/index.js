var ratchet = require('ratchet-npm/dist/js/ratchet');
var attachFastClick = require('fastclick');
var url = require('url');
var db = require('./db');
var $ = require('jquery');

var state = {
	previousPage: '',
	push: PUSH
}

var route = {
	'add_model': require('./routes/add_model'),
	'settings': require('./routes/settings'),
	'log_formats': require('./routes/log_formats'),
	'setting_selection': require('./routes/setting_selection'),
	'index': require('./routes/index'),
	'model': require('./routes/model'),
	'flight': require('./routes/flight'),
	'timer': require('./routes/timer')
}

function loaded () {
	console.log('STARTING');

	screen.orientation.lock('portrait');

	attachFastClick(document.body);
	$(window).on('push', function (e) {
		var pushUrl = url.parse(e.detail.state.url);
		var path = pushUrl.pathname
			.replace(/.html$/,'')
			.replace(/.*\//,'');
			
		if (route[path]) {
			route[path](pushUrl,state);
		}
		
		console.log('PATH:' + path);
		
		// Fix non-responsive input on mobile:
		$('input[type="text"]').on('touchstart',function(e){
			$(e.target).focus();
		});
		
		// Fix non-responsive textarea on mobile: 
		$('textarea').on('touchstart',function(e){
			$(e.target).focus();
		});
	});

	PUSH({url: 'index.html'}) // Load landing page
}

var app = {
	initialize: function() {
		if (document.URL.match(/^https?:/)) {
			this.onDeviceReady();
		}
		else {
			document.addEventListener('deviceready', this.onDeviceReady, false);
		}
	},
	onDeviceReady: function() {
		db.init(function(){
			loaded();
		});
	}
};

app.initialize();
