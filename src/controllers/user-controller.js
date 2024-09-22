const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

class UserController {
	index(req, res, next) {
		res.json({
			message: 'Hello from user controller',
		});
	}

	register(req, res, next) {
		console.log('req.user', req.user);
		res.json({
			email: 'Ly minh tan',
			password: '$2y$13$tck7GmMrUMhLGPO5Qn4NAu53nAVa..kJqTq/RiNZ28N/l1P3Nd.TK',
		});
	}

	login(req, res, next) {
		res.json({
			token: jwt.sign(
				{
					email: 'Ly minh tan',
					password:
						'$2y$13$tck7GmMrUMhLGPO5Qn4NAu53nAVa..kJqTq/RiNZ28N/l1P3Nd.TK',
					exp: Math.floor(Date.now() / 1000) + 60,
				},
				'RESTFULAPIs',
			),
		});
	}

	information(req, res, next) {
		res.json({
			email: 'Ly minh tan',
			password: '$2y$13$tck7GmMrUMhLGPO5Qn4NAu53nAVa..kJqTq/RiNZ28N/l1P3Nd.TK',
		});
	}
}
module.exports = new UserController();
