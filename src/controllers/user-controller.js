const User = require('../models/user-model');
class UserController {
	index(req, res, nex) {
		res.json({
			message: 'Hello from user controller',
		});
	}
}
module.exports = new UserController();
