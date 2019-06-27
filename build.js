#! /usr/bin/env node

var fs = require('fs');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var less = require('less');
var ratchet = require('ratchet-npm');
var NpmImportPlugin = require("less-plugin-npm-import");
var HBS = require('handlebars-generator');
var copy = require('copy-newer');

mkdirp.sync('./www/css');
mkdirp.sync('./www/js');
mkdirp.sync('./www/img');
mkdirp.sync('./www/fonts');
mkdirp.sync('./www/res');

browserify([
	'./src/js/index.js'
])
.bundle().pipe(fs.createWriteStream(
	'./www/js/index.js'
));

var css =
	fs.readFileSync('./node_modules/ratchet-npm/dist/css/ratchet.min.css','utf8') +
	fs.readFileSync('./src/css/index.less','utf8');

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

function log (x) {console.log(x)};

copy('**','./www/img',{
	cwd: './src/img',
	verbose: false
})
.then(()=>{}).catch(log);

copy('**','./www/res',{
	cwd: './src/res',
	verbose: false
})
.then(()=>{}).catch(log);

copy('**','./www/fonts',{
	cwd: './node_modules/ratchet-npm/dist/fonts',
	verbose: false
})
.then(()=>{}).catch(log);
