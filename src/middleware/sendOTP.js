const nodeMailer = require('nodemailer');
const config = require('../config');

const MiddlewareResendEmail = async (options) => {
	const transporter = nodeMailer.createTransport({
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

	await transporter.sendMail(mailOptions);
};

module.exports = MiddlewareResendEmail;
