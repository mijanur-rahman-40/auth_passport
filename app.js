const express = require('express');
const app = express();
const path = require('path');

const mongoose = require('mongoose');

const index = require('./routes/index');
const user = require('./routes/users');
const task = require('./routes/task');

const expressLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');

// Passport config
require('./config/passport')(passport);

// DB CONFIG
const key = require('./config/keys');
const database = key.mongoURI;


// config public folder
app.use('/public', express.static('public'));


// CONNECT TO MONGOOSE
mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log('MongoDb Connected..'))
    .catch(error => console.log(error));

// EJS
app.use(expressLayout);
app.set('view engine', 'ejs');

// app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/js/')]);

// BODY PARSER
app.use(express.urlencoded({
    extended: true
}));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variable
app.use((request, response, next) => {
    response.locals.success_message = request.flash('success_message');
    response.locals.error_message = request.flash('error_message');
    response.locals.error = request.flash('error');
    next();
});

// ROUTES
app.use(index);
app.use(task);
app.use('/user', user);

const PORT = process.env.PORT || 8889;

app.listen(PORT, console.log(`Server is started on PORT ${PORT}`));