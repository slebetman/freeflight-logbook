var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var page = require('../../templates/model');

module.exports = function (route, state) {
    console.log('FLIGHT LOG');

    console.log(state);

    var model = state.selected_model;

    $('.title').text(model.name);

    onclick('#back',function(){
        console.log('back');
        state.push({url: 'index.html'});
    })
}