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
	'/add_model': require('./routes/add_model'),
	'/settings': require('./routes/settings'),
	'/log_formats': require('./routes/log_formats'),
	'/setting_selection': require('./routes/setting_selection')
}

var loadingStage = 0;

db.init(function(){
	loadingStage++;
	if (loadingStage >= 2) {
		loaded();
	}
});

function loaded () {
	attachFastClick(document.body);
	$(window).on('push', function (e) {
		var pushUrl = url.parse(e.detail.state.url);
		var path = pushUrl.pathname
			.replace(/.html$/,'')
			.replace(/.*\//,'/');
			
		if (route[path]) {
			route[path](pushUrl,state);
		}
		
		console.log('PATH:' + path);
		
		// Fix non-responsive input on mobile:
		$('input[type="text"]').on('touchstart',function(){
			$(this).focus();
		});
		
		// Fix non-responsive textarea on mobile: 
		$('textarea').on('touchstart',function(){
			$(this).focus();
		});
	});
}

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
		loadingStage++;
		if (loadingStage >= 2) {
			loaded();
		}
    }
};

app.initialize();
