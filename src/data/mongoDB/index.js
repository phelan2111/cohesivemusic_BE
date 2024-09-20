const mongoose = require('mongoose');
const config = require('../../config');

async function connect() {
	await mongoose
		.connect(
			`mongodb+srv://${config.development.db.username}:${config.development.db.password}@music.8qvgt.mongodb.net/?retryWrites=true&w=majority&appName=music`,
		)
		.then(() => {
			console.log('Connect successfully');
		})
		.catch(() => {
			console.log('Do not connect to server...');
		});
}

module.exports = { connect };
