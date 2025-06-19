const nodeMailer = require('nodemailer');
const config = require('../config');
const cloudinary = require('cloudinary');
const logger = require('../utils/logger');

class ServiceCommon {
	async resendEmail(options) {
		const transporter = nodeMailer.createTransport({
			service: 'gmail',
			host: config.development.smpt.host,
			port: config.development.smpt.port,
			secure: false,
			auth: {
				user: config.development.smpt.mail,
				pass: config.development.smpt.appPass,
			},
			tls: {
				rejectUnauthorized: true,
				ciphers: 'SSLv3',
			},
		});

		const mailOptions = {
			from: config.development.smpt.mail,
			to: options.to,
			subject: options.subject,
			html: options.message,
		};

		try {
			await transporter.sendMail(mailOptions);
		} catch (error) {
			logger.error('resendEmail execute transporter fail', error)
		}
	}
	async uploadImage(formData, options, cb) {
		return await cloudinary.v2.uploader.upload(formData, options, cb);
	}
	async uploadVideo(formData, options, cb) {
		return await cloudinary.v2.uploader.upload(formData, { ...options, resource_type: 'video', chunk_size: 100000000 }, cb);
	}
}

module.exports = new ServiceCommon();
