const userRouter = require('./user-router')
const BrowseRouter = require('./browse-router');
function route(app) {
	app.use('/user', userRouter);
	app.use('/browse', BrowseRouter);
}

module.exports = route;