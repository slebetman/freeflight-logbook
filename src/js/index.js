var ratchet = require('ratchet-npm/dist/js/ratchet');
var attachFastClick = require('fastclick');
var url = require('url');

var state = {
	previousPage: '',
	push: PUSH
}

var route = {
	'/add_model': require('./routes/add_model'),
	'/settings': require('./routes/settings'),
	'/log_formats': require('./routes/log_formats')
}

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
		attachFastClick(document.body);
        app.receivedEvent('deviceready');
		window.addEventListener('push', function (e) {
			var pushUrl = url.parse(e.detail.state.url);
			var path = pushUrl.pathname.replace(/.html$/,'');
			console.log(path);
			
			if (route[path]) {
				route[path](pushUrl,state);
			}
		});
    },
    receivedEvent: function(id) {
        
    }
};

app.initialize();
