var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var page = require('../../templates/flight');

module.exports = function (route, state) {
    console.log('NEW FLIGHT');

    var model = state.selected_model;

    console.log('model', model);

    model.meta.fields.forEach(function(f){
        $(`li#${f}`).css({
            display: 'block'
        })
    });

    onclick('#start-flight',function(){
        var formData = page.getValues();
        console.log(formData);

        // data.model,
        // data.timestamp,
        // data.duration,
        // data.distance,
        // data.distance_unit,
        // data.location,
        // data.windings,
        // data.backoff,
        // data.torque,
        // data.torque_unit,
        // data.rubber_length,
        // data.rubber_length_unit,
        // data.rubber_width,
        // data.rubber_width_unit,
        // data.notes
        
        formData.model = model.rowid;
        formData.timestamp = Date.now();

        state.selected_model.flight = formData;

        console.log(state);
    })
}
