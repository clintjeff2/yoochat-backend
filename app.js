const express = require('express');
const morgan = require('morgan');
const errorController = require('./controllers/error.controller');
const ErrorApi = require('./utilities/ErrorApi');
const userRouter = require('./routes/users.routes');
const userContactController = require('./routes/user.contact.routes');

const app = express();

//parse body object to the request
app.use(express.json());

//display request  outcome during developement
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/user-contact', userContactController)

app.all('*', (req, res, next) => {
	console.log('Issues');
	next(new ErrorApi(`${req.originalUrl} is not found on this server`, 404));
});

app.use(errorController);

module.exports = app;
