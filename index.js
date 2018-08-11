'use strict'
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

const Admin = require('./src/handler/admin/home');
const Screens = require('./src/handler/screens');
const SignUp = require('./src/handler/user/signup');
const Login = require('./src/handler/user/login');
const Waiters = require('./src/handler/waiter/home');

const Models = require('./src/schema/models');
const models = Models(process.env.MONGO_DB_URL || 'mongodb://localhost/waiters', { useNewUrlParser: true });

const admin = Admin(models);
const login = Login(models);
const signUp = SignUp(models);
const screens = Screens(models);
const waiters = Waiters(models);

const app = express();

app.set("port", (process.env.PORT || 4444))

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())
app.use(session({cookieName: 'session', secret: 'random_string_goes_here', duration: 30 * 60 * 1000, activeDuration: 5 * 60 * 1000,}));
app.use(session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 60000 * 30
    },
    resave: true,
    saveUninitialized: true
}));
app.use(flash()); // set up http session

app.get('/', screens.getHomeScreen);

// app.post('/',)

app.get('/login', screens.getLoginScreen);
app.post('/login', login.userLogin)

app.get('/register', screens.getRegistrationScreen);
app.post('/register', signUp.validate)

// Waiter route to waiter's page
app.get('/waiters/:id', waiters.getWaiterScreen);
app.post('/waiters/:id', waiters.updateUser);

// Admin page route
app.get('/admin/:id', screens.getAdminScreen);
// app.post('/admin/:id')

// //logout screen
app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/login');
});
var port = app.get("port");

app.listen(port, function() {
    console.log('Server started at http://localhost:' + port)
});
