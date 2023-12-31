const express = require('express');
const morgan = require('morgan');
const errorController = require('./controllers/error.controller');
const ErrorApi = require('./utilities/ErrorApi');
const userRouter = require('./routes/users.routes');
const userContactRouter = require('./routes/user.contact.routes');
const groupRouter = require('./routes/groups.routes');
const groupContactRouter = require('./routes/group.contact.routes');

const app = express();

//parse body object to the request
app.use(express.json());

//display request  outcome during developement
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/user-contact', userContactRouter);
app.use('/api/v1/group', groupRouter);
app.use('/api/v1/group-contact', groupContactRouter);

app.all('*', (req, res, next) => {
	console.log('Issues');
	next(new ErrorApi(`${req.originalUrl} is not found on this server`, 404));
});

app.use(errorController);

module.exports = app;
