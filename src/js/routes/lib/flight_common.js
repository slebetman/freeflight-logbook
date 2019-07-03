var $ = require('jquery');
var db = require('../../db');
var onclick = require('./onclick');

var map = {
	unitLength: 'span.rubber_length_unit',
	unitWidth: 'span.rubber_width_unit',
	unitWeight: 'span.rubber_weight_unit',
	unitTorque: 'span.torque_unit'
}

var unitMap = {
	rubber_length_unit: 'unitLength',
	rubber_width_unit: 'unitWidth',
	rubber_weight_unit: 'unitWeight',
	torque_unit: 'unitTorque'
}

function mapUnits (data) {
	var ret = {};
	for (var k in unitMap) {
		ret[unitMap[k]] = data[k];
	}
	return ret;
}

function updateValues (data, extended) {
	[
		'location',
		'rubber_length',
		'rubber_width',
		'rubber_weight'

	].forEach(function(key){
		$(`input[name="${key}"]`).val(data[key]);
	});

	if (extended) {
		[
			'windings',
			'backoff',
			'torque'
	
		].forEach(function(key){
			$(`input[name="${key}"]`).val(data[key]);
		});
		$('textarea[name="notes"]').val(data.notes);
	}
}

function updateUnits (data, settingname, settingvalue) {
	console.log('updateUnits',data, settingname, settingvalue);

	[
		'unitLength',
		'unitWidth',
		'unitWeight',
		'unitTorque'

	].forEach(function(key){
		var datakey = key;
		if (key == 'unitWidth') {
			datakey = 'unitLength';
		}
		if (!settingvalue || settingname !== key) {
			$(map[key]).text(data[datakey]);
		}
	})
}

function registerLocationAutosuggest () {
	db.getLocations(function(loc){
		console.log('locations=',loc);
		var locationInput = $('input[name="location"]');
		var locationAutosuggest = $('#location-autosuggest');

		locationInput.on('input',e => {
			var input = locationInput.val();
			var matches = loc.filter(l => l.match(new RegExp(input,'i')));

			console.log(input, matches);

			if (matches.length > 0 && input != '') {
				console.log('show');
				var bbox = locationInput[0].getBoundingClientRect();

				console.log('bbox',bbox.bottom);

				$('.autosuggest')
					.html(matches.map(x => `<div class="autosuggest-value" data-value="${x}">${x}</div>`));

				locationAutosuggest
					.css('top',bbox.bottom)
					.show();
			}
			else {
				locationAutosuggest.hide();
			}
		});

		onclick('.autosuggest', e => {
			console.log('autosuggest clicked');

			var target = $(e.target);
			var val = target.data('value');

			if (val) {
				locationInput.val(val);
			}
		});

		locationInput.on('blur', e => {
			console.log('blur');
			locationAutosuggest.hide();
		})
	});
}

function showFields (model) {
	model.meta.fields.forEach(function(f){
		$(`li.table-view-cell.${f}`).show();
	});
}

function registerUnitSelection (state) {
	onclick('.setting_link', function(e){
		var target = $(e.target);
		state.setting = target.data('settingname');
		state.selected_setting = target.find('span.settings-text').text();
		console.log('setting='+state.setting);
	});
}

module.exports = {
	map,
	unitMap,
	mapUnits,
	updateValues,
	updateUnits,
	registerLocationAutosuggest,
	showFields,
	registerUnitSelection
}