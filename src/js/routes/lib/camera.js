function errorHandler (err) {
	console.error(err.message);
	alert(err.message);
}

function getPicture (callback) {
	var options = {
		quality: 20,
		destinationType: Camera.DestinationType.DATA_URL,
		sourceType: Camera.PictureSourceType.CAMERA,
		encodingType: Camera.EncodingType.JPEG,
		mediaType: Camera.MediaType.PICTURE,
		allowEdit: false,
		correctOrientation: true,
		targetHeight: 100,
		targetWidth: 100
	}

	navigator.camera.getPicture(callback, errorHandler, options);
}

module.exports = {
	getPicture: getPicture
}
