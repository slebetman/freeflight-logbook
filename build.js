#! /usr/bin/env node

const fs = require('fs');
const mkdirp = require('mkdirp');
const browserify = require('browserify');
const less = require('less');
const ratchet = require('ratchet-npm');
const NpmImportPlugin = require("less-plugin-npm-import");
const HBS = require('handlebars-generator');
const copy = require('copy-newer');
const sharp = require('sharp');

mkdirp.sync('./www/css');
mkdirp.sync('./www/js');
mkdirp.sync('./www/img');
mkdirp.sync('./www/fonts');
mkdirp.sync('./www/res');
mkdirp.sync('./www/res/icon/android');
mkdirp.sync('./www/res/icon/ios');

browserify([
	'./src/js/index.js'
])
.bundle().pipe(fs.createWriteStream(
	'./www/js/index.js'
))
.on('finish', ()=>console.log('done compiling js'));

var css =
	fs.readFileSync('./node_modules/ratchet-npm/dist/css/ratchet.min.css','utf8') +
	fs.readFileSync('./src/css/index.less','utf8');

less.render(css.toString('utf8'),{}, function(err, output) {
	if (err) {
		console.error(err);
	}
	else {
		fs.writeFileSync('./www/css/index.css',output.css);
		console.log('done compiling css');
	}
});

HBS.generateSite('src/templates','www').then(
function(){
	console.log('done compiling html');
},
function(err){
	console.error(err);
});

function log (x) {console.log(x)};

function generateIcons () {
	var icons = {
		ios: {
			"icon-small.png": 29,
			"icon-40.png": 40,
			"icon-50.png": 50,
			"icon.png": 57,
			"icon-small@2x.png": 58,
			"icon-60.png": 60,
			"icon-72.png": 72,
			"icon-76.png": 76,
			"icon-40@2x.png": 80,
			"icon-small@3x.png": 87,
			"icon-50@2x.png": 100,
			"icon@2x.png": 114,
			"icon-60@2x.png": 120,
			"icon-72@2x.png": 144,
			"icon-76@2x.png": 152,
			"icon-60@3x.png": 180
		},
		android: {
			"drawable-ldpi-icon.png": 36,
			"drawable-mdpi-icon.png": 48,
			"drawable-hdpi-icon.png": 72,
			"drawable-xhdpi-icon.png": 96,
			"drawable-xxhdpi-icon.png": 144,
			"drawable-xxxhdpi-icon.png": 192
		}
	}
	
	var dir = './www/res/icon';
	var originalIcon = fs.readFileSync('./src/img/icon.svg');

	var promises = [];
	
	for (var platform in icons) {
		(function(platform){
			var formats = icons[platform];
			
			for (var i in formats) {
				promises.push(function(i){
					var resolution = formats[i];
					var icon = sharp(originalIcon);
					return icon
						.resize(resolution, resolution)
						.png()
						.toBuffer()
						.then(png => {
							fs.writeFileSync(`${dir}/${platform}/${i}`, png, 'binary');
						});
					
				}(i));
			}
		})(platform);
	}
	
	return Promise.all(promises).then(() => 'done generating icons');
}

Promise.all([
	copy('**','./www/img',{
		cwd: './src/img',
		verbose: false
	}),
	copy('**','./www/res',{
		cwd: './src/res',
		verbose: false
	}),
	copy('**','./www/fonts',{
		cwd: './node_modules/ratchet-npm/dist/fonts',
		verbose: false
	})
])
.then(()=>console.log('done copying res')).catch(log);

generateIcons().then(log).catch(log);
