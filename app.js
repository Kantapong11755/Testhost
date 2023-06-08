require('dotenv').config()
var createError = require('http-errors');
const body_parser = require('body-parser');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require("cors");
const jwt = require('jsonwebtoken')
const session = require('express-session')
const bcrypt = require('bcrypt');
require('./passport-setup')



const connectDB = async () => {
  try {
    mongoose.set('strictQuery, false')
    mongoose.connect('mongodb+srv://admin:1234@cluster0.b6h9jlg.mongodb.net/?retryWrites=true&w=majority')
    console.log('mongo connected')
  }
  catch(error) {
    console.log(error)
    process.exit()
  }
}

mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://admin:1234@cluster0.b6h9jlg.mongodb.net/?retryWrites=true&w=majority",{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
        .then(() => console.log('connection successfuly'))
        .catch((err) => console.error(err))

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var admins = require('./routes/admin');


var app = express();

app.use(
  session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false},
  })
)

app.use (passport.initialize ());
app.use (passport.session());
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(3000,() =>{
  console.log('Run on port 3000')
})

app.use(body_parser.urlencoded({extended:false}));
app.use(body_parser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/scholarships', admins);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
