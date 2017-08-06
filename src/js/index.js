var ratchet = require('ratchet-npm/dist/js/ratchet');
var attachFastClick = require('fastclick');

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
    },
    receivedEvent: function(id) {
        
    }
};

app.initialize();
