const express = require('express');
const app = express();
const route = require('./routes');
const cors = require('cors');
const mongodb = require('./data/mongoDB');
const MorganMiddleware = require('./middleware/morgan');
const AuthService = require('./middleware/auth');
const Cloudinary = require('./middleware/cloudinary');
const BodyParser = require('./middleware/bodyParser');
const PORT = process.env.PORT || 3000;

// body parser
BodyParser(app);

// cloudinary;
Cloudinary();

// morgan;
MorganMiddleware(app);

// Cors;s
app.use(cors());

// Check auth
AuthService(app);

// todo: connect db
mongodb.connect();

// Route
route(app);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
