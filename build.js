#! /usr/bin/env node

var fs = require('fs');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var less = require('less');
var ratchet = require('ratchet-npm');
var NpmImportPlugin = require("less-plugin-npm-import");
var HBS = require('handlebars-generator');

mkdirp.sync('./www/css');
mkdirp.sync('./www/js');
mkdirp.sync('./www/img');
mkdirp.sync('./www/fonts');
mkdirp.sync('./www/res');

browserify([
	'./src/js/index.js'
]).bundle().pipe(fs.createWriteStream(
	'./www/js/index.js'
));

var css =
	fs.readFileSync('./node_modules/ratchet-npm/dist/css/ratchet.min.css') +
	fs.readFileSync('./src/css/index.less');

less.render(css.toString('utf8'),{}, function(err, output) {
	if (err) {
		console.error(err);
	}
	else {
		fs.writeFileSync('./www/css/index.css',output.css);
	}
});

HBS.generateSite('src/templates','www').then(
function(){},
function(err){
	console.error(err);
});

ncp('./src/img','./www/img',function (err) {
	if (err) {
		console.error(err);
	}
});

ncp('./src/res','./www/res',function (err) {
	if (err) {
		console.error(err);
	}
});

ncp('./node_modules/ratchet-npm/dist/fonts','./www/fonts',function (err) {
	if (err) {
		console.error(err);
	}
});
