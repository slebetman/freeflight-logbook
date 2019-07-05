var ratchet = require('ratchet-npm/dist/js/ratchet');
var url = require('url');
var db = require('./db');
var $ = require('jquery');

var state = {
	previousPage: '',
	push: PUSH
}

var route = {
	'add_model': require('./routes/add_model'),
	'edit_model': require('./routes/edit_model'),
	'settings': require('./routes/settings'),
	'log_formats': require('./routes/log_formats'),
	'setting_selection': require('./routes/setting_selection'),
	'index': require('./routes/index'),
	'model': require('./routes/model'),
	'flight': require('./routes/flight'),
	'edit_flight': require('./routes/edit_flight'),
	'log_format_edit' : require('./routes/log_format_edit'),
	'timer': require('./routes/timer')
}

function topLevelError (err) {
	var msg = err.message || err;
	console.log('ERROR:', msg);

	if (! msg.match(/Uncaught module cordova-plugin.+already defined/)) {
		$('.content').html(`
			<div>
				<h1>ERROR</h1>
				${msg}
			</div>
		`);
	}
}

function loaded () {
	console.log('STARTING');

	screen.orientation.lock('portrait');

	window.onerror = topLevelError;
	$(window).on('push', function (e) {
		var pushUrl = url.parse(e.detail.state.url);
		var path = pushUrl.pathname
			.replace(/.html$/,'')
			.replace(/.*\//,'');
			
		if (route[path]) {
			try {
			route[path](pushUrl,state);
		}
			catch(err) {
				topLevelError(err);
			}
		}
		
		console.log('PATH:' + path);
		
		// Fix non-responsive input on mobile:
		[
			'input[type="text"]',
			'input[type="number"]',
			'textarea',
		].forEach(
			x => $(x).on('touchstart',
				e => $(e.target).focus()
			)
		);

		[
			'input[type="radio"]',
			'label'
		].forEach(
			x => $(x).on('touchstart',
				e => $(e.target).click()
			)
		);

		$('div.radio').on('touchstart', e => {
			$(e.target).find('input[type="radio"]').click()
		})
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
