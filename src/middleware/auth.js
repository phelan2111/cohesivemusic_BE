const jsonwebtoken = require('jsonwebtoken');

function AuthService(app) {
	app.use(function (req, res, next) {
		if (req.headers && req.headers.token) {
			jsonwebtoken.verify(
				req.headers.token,
				'RESTFULAPIs',
				function (err, decode) {
					if (err) req.user = undefined;
					req.user = decode;
					next();
				},
			);
		} else {
			req.user = undefined;
			next();
		}
	});
}

module.exports = AuthService;
