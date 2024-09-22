const Enum = require('../data/enum');
const Helper = require('../utils/helper');

class UserValidator {
	isLoggedIn(req, res, next) {
		if (req.user) {
			next();
		} else {
			res.json({
				...Enum.response.unauthorized,
			});
		}
	}
}

module.exports = new UserValidator();
