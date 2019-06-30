var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var page = require('../../templates/index');

module.exports = function (route, state) {
    console.log('TIMER');

    var t = 0;

    function formatTime (time) {
        var seconds = Math.floor(time);

        var ms = (time % 1).toFixed(2).replace(/.\./,'');
        var m = Math.floor(seconds / 60);
        var s = (seconds % 60).toString();
        if (s.length == 1) {
            s = '0' + s;
        }

        return `${m}:${s}.${ms}`;
    }

    setInterval(function(){
        t += 0.01;
        $('#timer').text(formatTime(t));
    },10);
}
