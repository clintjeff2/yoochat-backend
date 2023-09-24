const mongoose = require('mongoose');
const dotenv = require('dotenv');

//read environment variables
dotenv.config({ path: './.env' });

const app = require('./app');

mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((con) => {
		console.log('CONNECTED TO DATABASE');
	});

app.listen(process.env.PORT, () => {
	console.log('Connected to port 8000');
});

//implement unhandled exceptions
//implement unhandled rejectsions
