#! /usr/bin/env node

var fs = require('fs');
var ncp = require('ncp').ncp;
var copy = require('copy-newer');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var less = require('less');
var ratchet = require('ratchet-npm');
var NpmImportPlugin = require("less-plugin-npm-import");

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
		console.log(err);
	}
	else {
		fs.writeFileSync('./www/css/index.css',output.css);
	}
})

copy('./*.html','./www/',{cwd:'./src'});

ncp('./src/img','./www/img',function (err) {
	if (err) {
		console.log(err);
	}
});

ncp('./src/res','./www/res',function (err) {
	if (err) {
		console.log(err);
	}
});

ncp('./node_modules/ratchet-npm/dist/fonts','./www/fonts',function (err) {
	if (err) {
		console.log(err);
	}
});
