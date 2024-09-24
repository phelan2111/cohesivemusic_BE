const jwt = require('jsonwebtoken');
var randomstring = require('randomstring');

class Helper {
	isEmpty(dataItem) {
		if (dataItem) {
			return false;
		}
		return true;
	}
	generateToken(dataItem, exp) {
		return jwt.sign(
			{
				...dataItem,
				exp: Math.floor(Date.now() / 1000) + 60 * exp,
			},
			'RESTFULAPIs',
		);
	}
	randomOTP() {
		return randomstring.generate({
			length: 6,
			charset: 'numeric',
		});
	}
}

module.exports = new Helper();
