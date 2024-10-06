const cloudinary = require('cloudinary').v2;
const config = require('../config');

function Cloudinary() {
	return cloudinary.config({
		cloud_name: config.development.cloudinary.cloudName,
		api_key: config.development.cloudinary.apiKey,
		api_secret: config.development.cloudinary.apiSecret,
	});
}

module.exports = Cloudinary;
