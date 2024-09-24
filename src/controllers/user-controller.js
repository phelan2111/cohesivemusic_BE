const User = require('../models/user-model');
const OTP = require('../models/otp-model');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const Helper = require('../utils/helper');
const Enum = require('../data/enum');
const MiddlewareResendEmail = require('../middleware/sendOTP');

class UserController {
	index(req, res, next) {
		res.json({
			message: 'Hello from user controller',
		});
	}

	verifyUsername(req, res, next) {
		try {
			logger.info('Controller user execute verify username');
			logger.debug('Controller user get request from client', req.body);
			const { email } = req.body;
			User.findOne({ email: email }).then((user) => {
				const hasUserExist = Helper.isEmpty(user);
				if (!hasUserExist) {
					res.json({
						...Enum.response.userExistedInSystem,
					});
				} else {
					const otpRandom = Helper.randomOTP();
					OTP.findOne({ email })
						.then((otpFindOne) => {
							if (!Helper.isEmpty(otpFindOne)) {
								otpFindOne.otp = otpRandom;
								otpFindOne.save();
							} else {
								const otpScheme = new OTP({
									email,
									otp: otpRandom,
								});
								otpScheme.save();
							}
						})
						.then(() => {
							MiddlewareResendEmail({
								to: email,
								subject: 'Your OTP',
								message: `<p>Your OTP is: <strong>${otpRandom}</strong></p>`,
							})
								.then(() => {
									logger.info('Controller user execute MiddlewareResendEmail success');
									res.json({
										...Enum.response.success,
										data: {
											email,
											token: Helper.generateToken(
												{
													email,
												},
												5,
											),
										},
									});
								})
								.catch(() => {
									res.json({
										...Enum.response.userExistedInSystem,
									});
								});
						})
						.catch((error) => {
							logger.error(error.message);
						});
				}
			});
		} catch (error) {
			logger.error(error.message);
		}
	}

	verifyOTP(req, res, next) {
		try {
			logger.info('Controller user execute verify OTP');
			logger.debug('Controller user execute verify OTP', req.body);
			const { otp } = req.body;
			const { email } = req.user;
			OTP.findOne({ otp })
				.then((otpFindOne) => {
					if (!Helper.isEmpty(otpFindOne)) {
						logger.info('Controller user execute verify OTP success');
						res.json({
							...Enum.response.success,
							data: {
								email,
								token: Helper.generateToken(
									{
										email,
									},
									25,
								),
							},
						});
					}
				})
				.catch(() => {
					res.json({
						...Enum.response.otpNotMatch,
					});
				});
		} catch (error) {
			logger.error(error.message);
		}
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
					password: '$2y$13$tck7GmMrUMhLGPO5Qn4NAu53nAVa..kJqTq/RiNZ28N/l1P3Nd.TK',
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
