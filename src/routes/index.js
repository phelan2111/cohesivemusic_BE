const userRouter = require('./user-router')
function route(app) {
    app.use('/user', userRouter);
}

module.exports = route;