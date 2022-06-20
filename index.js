const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');
const cors = require('cors');

// create server
const app = express();

// connect to database
connectDB();

// enable cors
app.use(cors());

// enable express.json
app.use(express.json({ extended: true }));

// app PORT
const port = process.env.PORT || 4000;

// Import routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// run the app
app.listen(parseInt(port), '0.0.0.0', () => {
	  console.log(`Server is running on port ${ port }`);
});