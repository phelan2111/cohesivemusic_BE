const userRouter = require('./user-router')
const BrowseRouter = require('./browse-router');
const AttributeRouter = require('./attribute-router');
const SingerRouter = require('./singer-router');

function route(app) {
	app.use('/user', userRouter);
	app.use('/browse', BrowseRouter);
	app.use('/attribute', AttributeRouter);
	app.use('/singer', SingerRouter);
}

module.exports = route;