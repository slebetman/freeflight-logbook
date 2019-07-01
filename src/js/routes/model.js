var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var moment = require('moment');
var page = require('../../templates/model');

module.exports = function (route, state) {
    console.log('FLIGHT LOG');

    console.log(state);

    var model = state.selected_model;

    if (state.saved_timer && state.selected_model.flight) {
        state.selected_model.flight.duration = state.saved_timer;
        state.selected_model.flight.timestamp = moment.now();
        console.log('logged time=',moment.utc(state.saved_timer).format('mm:ss.SSS'));
        console.log(JSON.stringify(state.selected_model.flight,null,2));
    }

    $('.title').text(model.name);

    onclick('#back',function(){
        console.log('back');
        state.push({url: 'index.html'});
    })
}