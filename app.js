const express = require('express');
const morgan = require('morgan');
const errorController = require('./controllers/error.controller');
const ErrorApi = require('./utilities/ErrorApi');
const userRouter = require('./routes/users.routes');
const userContactRouter = require('./routes/user.contact.routes');
const groupRouter = require('./routes/groups.routes');
const groupContactRouter = require('./routes/group.contact.routes');
const messageUserRoute = require('./routes/message.users.routes');
const messageGroupRoute = require('./routes/message.groups.routes');

const app = express();

//parse body object to the request
app.use(express.json());

//display request  outcome during developement
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/user-contact', userContactRouter);
app.use('/api/v1/group', groupRouter);
app.use('/api/v1/group-contact', groupContactRouter);
app.use('/api/v1/message-user', messageUserRoute);
app.use('/api/v1/message-group', messageGroupRoute);

app.all('*', (req, res, next) => {
	console.log('Issues');
	next(new ErrorApi(`${req.originalUrl} is not found on this server`, 404));
});

app.use(errorController);

module.exports = app;
