const morgan = require('morgan');
const logger = require('../utils/logger');

function morganMiddleware(app) {
	const morganSetUp = morgan(
		':method :url :status :res[content-length] - :response-time ms',
		{
			stream: {
				write: (message) => logger.http(message.trim()),
			},
		},
	);
	app.use(morganSetUp);
}

module.exports = morganMiddleware;
