var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var page = require('../../templates/index');
var moment = require('moment');

module.exports = function (route, state) {
    console.log('TIMER');

    var t = 0;
    var start = moment();

    setInterval(function(){
        var elapsed = moment().diff(start);
        $('#timer').text(moment.utc(elapsed).format('mm:ss.SS'));
    },10);
}
