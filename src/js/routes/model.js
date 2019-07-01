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

    function loadLogs () {
        db.logs(model.rowid, function(logs){
            var fields = model.meta.fields;

            console.log('logs=',logs);
            console.log('fields=',fields);

            var logTable = $('<table/>');
            var logHeaders = $('<tr class="header" />');
            logHeaders.append(fields.map(function(f){
                f = f.replace(/_/g,' ')
                    .replace('length', 'len')
                    .replace('weight', 'wt')
                    .replace('rubber', 'rub');

                return $('<td/>').text(f) 
            }));

            logTable.append(logHeaders);
            logs.forEach(function(row){
                var logData = $('<tr/>');

                fields.forEach(function(f){
                    var val = row[f];
                    if (f === 'duration') {
                        val = moment.utc(val).format('mm:ss.SSS');
                    }

                    console.log('field ',f,val);
                    logData.append($('<td/>').text(val));
                });
                logTable.append(logData);
            });

            $('.content').html(logTable);
        });
    }

    if (state.saved_timer && state.selected_model.flight) {
        var flight = state.selected_model.flight;

        flight.duration = state.saved_timer;
        flight.timestamp = moment.now();
        state.saved_timer = undefined;

        for (var k in flight) {
            if (flight[k] === undefined) {
                flight[k] = '';
            }
        }

        console.log('logged time=',moment.utc(flight.duration).format('mm:ss.SSS'));
        console.log(JSON.stringify(flight,null,2));

        db.addLog(flight, function(){
            console.log('saved log');
            loadLogs();
        });
    }
    else {
        loadLogs();
    }

    $('.title').text(model.name);

    onclick('#back',function(){
        console.log('back');
        state.push({url: 'index.html'});
    })
}