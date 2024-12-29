const jwt = require('jsonwebtoken');
var randomstring = require('randomstring');
const logger = require('../utils/logger');

class Helper {
	isEmpty(value) {
		try {
			if (value === undefined || value === null || value === '' || value.length === 0) {
				return true;
			}
			return false;
		} catch {
			return true;
		}
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
	isEmptyObjectByValidate(object, arrayField) {
		try {
			for (let index = 0; index < arrayField.length; index++) {
				const field = arrayField[index];
				if (this.isEmpty(object?.[field])) {
					return true;
				}
			}
			return false;
		} catch (error) {
			logger.error(error);
		}
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

	cleanObject(obj) {
		for (const propName in obj) {
			if (this.isEmpty(obj[propName])) {
				delete obj[propName];
			}
		}
		return obj;
	}

	search(search, query) {
		if (this.isEmpty(search)) {
			if (this.isEmpty(query)) {
				return {};
			}
			return query;
		}

		return {
			...query,
			$text: { $search: search },
		};
	}
	findItem(dataItem, field, data) {
		const index = dataItem.findIndex((item) => item?.[field] === data);
		const isExist = index !== -1;
		return { isExist, index };
	}
}

module.exports = new Helper();
