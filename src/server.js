const express = require('express');
const app = express();
const morgan = require('morgan');
const route = require('./routes');
const cors = require('cors');

app.use(morgan('combined'));

// example about cors:
// var corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200
// }

// Cors

app.use(cors());

//Route
route(app);

app.listen(3000, () => {
	console.log('Server started on port 3000');
});
