const morgan = require('morgan');
const logger = require('../utils/logger');

function MorganMiddleware(app) {
	const morganSetUp = morgan(
		':method :url :status :res[content-length] - :response-time ms',
		{
			stream: {
				write: (message) => logger.info(message.trim()),
			},
		},
	);
	app.use(morganSetUp);
}

module.exports = MorganMiddleware;
