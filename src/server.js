const express = require('express');
const app = express();
const route = require('./routes');
const cors = require('cors');
// const mongodb = require('./data/mongoDB');
const MorganMiddleware = require('./middleware/morgan');
const AuthService = require('./middleware/auth');
const Cloudinary = require('./middleware/cloudinary');
const BodyParser = require('./middleware/bodyParser');

//body parser
BodyParser(app);

//cloudinary
Cloudinary();

//morgan
MorganMiddleware(app);

// Cors
app.use(cors());

// Check auth
AuthService(app);

//todo: connect db
// mongodb.connect();

//Route
route(app);

module.exports = app;
