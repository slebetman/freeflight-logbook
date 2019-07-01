var $ = require('jquery');
var db = require('../db');
var alert = require('./lib/alert');
var onclick = require('./lib/onclick');
var page = require('../../templates/flight');
var moment = require('moment');

var map = {
    unitLength: 'span.rubber_length_unit',
    unitWidth: 'span.rubber_width_unit',
    unitWeight: 'span.rubber_weight_unit',
    unitTorque: 'span.torque_unit'
}

module.exports = function (route, state) {
    console.log('NEW FLIGHT');

    var model = state.selected_model;

    console.log('model', model);

    state.previousPage = route.pathname;
    
    (function(){
		var settingname = state.setting;
        var settingvalue = state.selected_setting;
        state.setting = undefined;
        state.selected_setting = undefined;
        
        db.settings(settings => {
            if (!settingvalue || settingname !== 'unitLength') {
                $('span.rubber_length_unit').text(settings.unitLength);
            }
			if (!settingvalue || settingname !== 'unitWidth') {
				$('span.rubber_width_unit').text(settings.unitLength);
            }
			if (!settingvalue || settingname !== 'unitWeight') {
				$('span.rubber_weight_unit').text(settings.unitWeight);
            }
			if (!settingvalue || settingname !== 'unitTorque') {
                $('span.torque_unit').text(settings.unitTorque);
            }
        });

        if (settingname && settingvalue) {
            $(map[settingname]).text(settingvalue);
        }
    })();

    model.meta.fields.forEach(function(f){
        $(`li.table-view-cell.${f}`).css({
            display: 'block'
        })
    });

    onclick('.setting_link', function(e){
		var target = $(e.target);
		state.setting = target.data('settingname');
		state.selected_setting = target.find('span.settings-text').text();
		console.log('setting='+state.setting);
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
        formData.timestamp = moment.now();

        state.selected_model.flight = formData;

        console.log(state);
    })
}
