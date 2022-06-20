const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
	try {
		console.log('Connecting to database...');
		await mongoose.connect(process.env.DB_MONGO, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log('MongoDB Connected...');
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

module.exports = connectDB;