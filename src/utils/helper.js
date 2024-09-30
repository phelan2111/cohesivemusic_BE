const jwt = require('jsonwebtoken');
var randomstring = require('randomstring');
const logger = require('../utils/logger');

class Helper {
	isEmpty(dataItem) {
		if (dataItem) {
			return false;
		}
		return true;
	}
	isEmptyObject(dataItem) {
		const values = Object.values(dataItem);
		for (let index = 0; index < values.length; index++) {
			const item = values[index];
			if (this.isEmpty(item)) {
				return true;
			}
		}
		return false;
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
	convertTime(date) {
		try {
			return new Date(date).getTime();
		} catch (error) {
			logger.error('Helper execute convertTime error', error);
		}
	}
}

module.exports = new Helper();
