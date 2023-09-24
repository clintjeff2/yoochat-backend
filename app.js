const express = require('express');
const morgan = require('morgan');

const app = express();

//parse body object to the request
app.use(express.json());

//display request  outcome during developement
if(process.env.NODE_ENV === 'development')
  app.use(morgan('dev'));

module.exports = app;