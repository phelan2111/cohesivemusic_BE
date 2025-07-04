const User = require('../models/user-model');
const OTP = require('../models/otp-model');
const logger = require('../utils/logger');
const Helper = require('../utils/helper');
const Enum = require('../data/enum');
const ServiceCommon = require('../services/common');
const ServiceUser = require('../services/user');
const config = require('../config');
const bcrypt = require('bcryptjs');
const VerifyTokenGG = require('../middleware/google');
const helper = require('../utils/helper');
const Playlist = require('../models/playlist-model');
const SongOfPlaylist = require('../models/songOfPlaylist-model');

class UserController {
	//[POST]-[/user/verifyUsername]
	verifyUsername(req, res, next) {
		try {
			logger.info('Controller user execute verify username');
			logger.debug('Controller user get request from client', req.body);
			const { email } = req.body;
			User.findOne({ email }).then((user) => {
				const hasUserExist = Helper.isEmpty(user);
				if (!hasUserExist) {
					res.json({
						...Enum.user.userExistedInSystem,
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
							ServiceCommon.resendEmail({
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
										...Enum.user.userExistedInSystem,
									});
								});
						})
						.catch((error) => {
							logger.error(error.message);
							res.json({
								...Enum.user.userExistedInSystem,
							});
						});
				}
			});
		} catch (error) {
			logger.error(error.message);
			res.json({
				...Enum.user.userExistedInSystem,
			});
		}
	}

	//[POST]-[/user/resendOTP]
	resendOTP(req, res, next) {
		try {
			logger.info('Controller user execute verify username');
			logger.debug('Controller user get request from client', req.body);
			const { email } = req.body;
			const otpRandom = Helper.randomOTP();
			OTP.findOneAndUpdate({ email }, { otp: otpRandom })
				.then(() => {
					ServiceCommon.resendEmail({
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
								...Enum.user.userExistedInSystem,
							});
						});
				})
				.catch((error) => {
					logger.error(error.message);
				});
		} catch (error) {
			logger.error(error.message);
		}
	}

	//[POST]-[/user/verifyOTP]
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
									5,
								),
							},
						});
					} else {
						res.json({
							...Enum.response.otpNotMatch,
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

	//[POST]-[/user/register]
	register(req, res, next) {
		try {
			logger.info('Controller user execute register');
			const { password, firstName, lastName } = req.body;
			const { email } = req.user;
			const userScheme = new User({
				password: bcrypt.hashSync(password, 10),
				firstName,
				lastName,
				email,
				status: Enum.user.status.inActive,
				role: Enum.user.role.normal,
				cover: config.development.defaultImage.cover,
				avatar: config.development.defaultImage.avatar,
			});
			userScheme
				.save()
				.then((user) => {
					const playList = new Playlist({
						viewSaves: 0,
						userId: user._id.toString(),
						songs: [],
						status: Enum.playList.status.user,
						descriptionPlaylist: 'Liked',
						image: config.development.defaultImage.playlist,
						theme: 'Liked',
						namePlaylist: 'Liked Songs',
					});
					playList
						.save()
						.then((item) => {
							const songOfPlaylist = new SongOfPlaylist({
								playlistId: item._id,
								songs: [],
							});
							songOfPlaylist.save().then(() => {
								res.json({
									...Enum.response.success,
								});
							});
						})
						.catch((error) => {
							throw new Error(error);
						});
				})
				.catch((error) => {
					logger.error('Controller user execute register', error);
					res.json({
						...Enum.response.systemError,
					});
				});
		} catch (error) {
			logger.error('Controller user execute register', error.message);
		}
	}

	//[POST]-[/user/loginWithGG]
	loginWithGG(req, res, next) {
		try {
			logger.info('Controller user execute registerWithGG');
			VerifyTokenGG(req.headers?.token)
				.then((dataItem) => {
					const infoUser = {
						password: dataItem.user?.sub,
						firstName: dataItem.user?.family_name,
						lastName: dataItem.user?.given_name,
						email: dataItem.user?.email,
						status: Enum.user.status.active,
						role: Enum.user.role.normal,
						cover: config.development.defaultImage.cover,
						avatar: dataItem.user?.picture,
					};
					const token = Helper.generateToken(
						{
							...infoUser,
						},
						1800,
					);
					User.findOne({ email: dataItem.user?.email }).then((user) => {
						if (helper.isEmpty(user)) {
							const userScheme = new User({
								...infoUser,
								token,
							});
							userScheme
								.save()
								.then(() => {
									res.json({
										...Enum.response.success,
										data: {
											token,
											info: infoUser,
										},
									});
								})
								.catch((error) => {
									logger.error('Controller user execute register', error);
									res.json({
										...Enum.response.systemError,
									});
								});
						} else {
							User.findOneAndUpdate({ email: infoUser.email }, { token, status: Enum.user.status.active })
								.then((user) => {
									const response = {
										email: user.email,
										firstName: user.firstName,
										lastName: user.lastName,
										gender: user.gender,
										playlistId: user.playlistId,
										role: user.role,
										avatar: user.avatar,
									};
									res.json({
										...Enum.response.success,
										data: {
											info: response,
											token,
										},
									});
								})
								.catch((error) => {
									logger.error('Controller user execute login', error);
									res.json({ ...Enum.response.systemError });
								});
						}
					});
				})
				.catch(() => {
					logger.error('UserValidator execute verifyTokenGG fail');
					res.json({
						...Enum.response.systemError,
					});
				});
		} catch (error) {
			logger.error('Controller user execute register', error.message);
		}
	}

	//[POST]-[/user/login]
	login(req, res, next) {
		try {
			const { id, password, ...rest } = req.body;
			const token = Helper.generateToken(
				{
					...rest,
					password,
					id,
				},
				1800,
			);

			User.findByIdAndUpdate(id, { token, status: Enum.user.status.active })
				.then((user) => {
					const response = {
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName,
						gender: user.gender,
						playlistId: user.playlistId,
						role: user.role,
						avatar: user.avatar,
					};
					res.json({
						...Enum.response.success,
						data: {
							info: response,
							token,
						},
					});
				})
				.catch((error) => {
					logger.error('Controller user execute login', error);
					res.json({ ...Enum.response.systemError });
				});
		} catch (error) {
			logger.error('Controller user execute login', error.message);
		}
	}

	//[GET]-[/user/details]
	details(req, res, next) {
		const { userId } = req.query;

		User.findOne({ _id: userId })
			.then((userItem) => {
				res.json({
					...Enum.response.success,
					data: ServiceUser.convertResponseGenre(userItem),
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[GET]-[/user]
	getList(req, res, next) {
		logger.info('Controller user execute getList');
		const { from, limit, status = Enum.user.status.active, search = '', ...rest } = req.query;

		const query = Helper.search(search, {
			status,
		});

		User.find(query)
			.limit(limit)
			.skip(from)
			.sort(rest)
			.then((dataItem) => {
				const list = dataItem.map((i) => {
					const user = i;
					user.token = '';
					delete user.token;
					return user;
				});
				User.countDocuments(query)
					.exec()
					.then((total) => {
						res.json({
							...Enum.response.success,
							data: {
								total,
								list,
							},
						});
					});
			});
	}

	//[POST]-[/user]
	update(req, res, next) {
		const { userId, ...rest } = req.body;

		User.findByIdAndUpdate(userId, rest)
			.then(() => {
				res.json({
					...Enum.response.success,
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[POST]-[/user/upload]
	upload(req, res, next) {
		logger.info('Controller singer execute upload image username');
		logger.debug('Controller singer get request from client', req.file);

		ServiceCommon.uploadImage(req.file.path, {
			folder: 'user/image',
			use_filename: true,
		})
			.then((data) => {
				res.json({
					...Enum.response.success,
					data: {
						link: data.url,
						name: data.original_filename,
						createAt: new Date(data.created_at).getTime(),
					},
				});
			})
			.catch((error) => {
				logger.error(error);

				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[PUT]-[/user]
	createByBackOffice(req, res, next) {
		logger.info('Controller singer execute createByBackOffice image username');
		logger.debug('Controller singer get request from client', req.body);
		const { cover, avatar, ...rest } = req.body;

		//create construct
		const scheme = {
			...rest,
		};
		if (cover) {
			scheme.cover = cover;
		}
		if (avatar) {
			scheme.avatar = avatar;
		}

		//create scheme
		const userScheme = new User({
			...scheme,
			status: Enum.user.status.inActive,
		});

		//random password and hash 10
		const password = bcrypt.hashSync(Helper.randomOTP(), 10);

		// send email service
		ServiceCommon.resendEmail({
			to: rest.email,
			subject: 'General password',
			message: `<p>Your password is: <strong>${password}</strong></p>`,
		})
			.then(() => {
				logger.info('Controller user execute MiddlewareResendEmail success');
				userScheme
					.save()
					.then((user) => {
						logger.info('Controller user execute scheme user');
						res.json({
							data: {
								userId: user._id,
							},
							...Enum.response.success,
						});
					})
					.catch((error) => {
						logger.error('Controller user execute createByBackOffice', error);
						res.json({
							...Enum.response.systemError,
						});
					});
			})
			.catch(() => {
				logger.error('Controller user execute createByBackOffice', error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[DELETE]-[/genre]
	updateStatus(req, res, next) {
		const { userId, status } = req.body;

		User.findByIdAndUpdate(userId, { status })
			.then(() => {
				res.json({
					...Enum.response.success,
				});
			})
			.catch((error) => {
				logger.error(error);
				res.json({
					...Enum.response.systemError,
				});
			});
	}

	//[POST]-[/user/forgot]
	forgot(req, res, next) {
		try {
			logger.info('Controller user execute forgot');
			logger.debug('Controller user execute forgot', req.body);
			const { email } = req.body;
			User.findOne({ email }).then((user) => {
				const hasUserExist = Helper.isEmpty(user);
				if (hasUserExist) {
					res.json({
						...Enum.user.userExistedInSystem,
					});
				} else {
					const token = Helper.generateToken(
						{
							email,
						},
						5,
					);
					ServiceCommon.resendEmail({
						to: email,
						subject: 'Reset password',
						message: `<p>
						<a href="https://cohesivemusic.vercel.app/kyc/reset/${token}">
						click here to reset password</a>
						</p>`,
					})
						.then(() => {
							logger.info('Controller user execute MiddlewareResendEmail success');
							res.json({
								...Enum.response.success,
							});
						})
						.catch(() => {
							res.json({
								...Enum.user.userExistedInSystem,
							});
						});
				}
			});
		} catch (error) {
			logger.error(error.message);
			res.json({
				...Enum.response.systemError,
			});
		}
	}

	//[POST]-[/user/reset]
	reset(req, res, next) {
		try {
			logger.info('Controller user execute reset');
			logger.debug('Controller user execute reset', req.body);
			const { password } = req.body;
			const { email } = req.user;

			User.findByIdAndUpdate({ email }, { password: bcrypt.hashSync(password, 10) })
				.then(() => {
					res.json({
						...Enum.response.success,
					});
				})
				.catch(() => {
					res.json({
						...Enum.response.systemError,
					});
				});
		} catch (error) {
			logger.error(error.message);
			res.json({
				...Enum.response.systemError,
			});
		}
	}
}
module.exports = new UserController();
