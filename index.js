'use strict'
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const moment = require('moment');

const Admin = require('./src/handler/admin/home');
const Friends = require('./src/handler/waiter/friends');
const Screens = require('./src/handler/screens');
const SignUp = require('./src/handler/user/signup');
const Login = require('./src/handler/user/login');
const Waiters = require('./src/handler/waiter/home');

const API = require('./src/api/api');

const Models = require('./src/schema/models');
const models = Models(process.env.MONGO_DB_URL || 'mongodb://localhost/waiters', { useNewUrlParser: true });

const Api = API(models);

const admin = Admin(models);
const friends = Friends(models);
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
app.use(session({
    secret: 'keyboard cat',
    // cookie: {
    //     maxAge: 60000 * 30
    // },
    resave: true,
    saveUninitialized: true
}));
app.use(flash()); // set up http session

app.get('/login', (req, res)=> {
    // console.log('fnfmf;');
    
    res.redirect('/friends');
})
//app.get('/', screens.getHomeScreen);

// app.post('/',)

app.get('/login', screens.getLoginScreen);
app.post('/login', login.userLogin)

app.get('/register', screens.getRegistrationScreen);
app.post('/register', Api.createNewUser);

// Waiter route to waiter's page
app.get('/waiters/:id', waiters.getWaiterScreen);
app.post('/waiters/:id', waiters.updateUserDays);

// Waiter route to waiter's page
app.get('/settings/:id', screens.getWaiterSettingsScreen);
// app.post('/settings/:id', waiters.updateUserProfile);

// Admin page route
app.get('/admin/:id', screens.getAdminScreen);
// app.post('/admin/:id')

// Friends route to friend's page
app.get('/friends', friends.getFriendsScreen);

app.get('/friends/:id', friends.viewMoreDetails);
app.post('/friends/:id', friends.addFriend);

// app.get('/waiter/:id/friend/:friendId', friends.getUserScreen);
// app.post('/waiter/:id/friend/:friendId', friends.addFriend);

// //logout screen
app.get('/logout', function(req, res, done) {
    if (req.session && req.session.user) {
        let { user } = req.session;
        
        models.User.findOneAndUpdate({
            username: user.username,
            _id: user._id
        }, {
            timestamp: {
                lastSeen: moment.utc()
            }
        }, (err, user) => {
            if (err) return done(err);
        })
    }
    
    req.session.destroy();
    res.redirect('/login');
});
var port = app.get("port");

app.listen(port, function() {
    console.log('Server started at http://localhost:' + port)
});


/**
 * register
 * login
 * user
 * admin
 * messages
 * friends
 *  
 *     
 *  Register 
 *      - Post 
 *      - Get
 * 
 * Login
 *  - Post
 *  - Get
 * 
 * Admin    Messages    User
 *  - CRUD
 * 
 *

 app.get('/api/create'); // returns errors
 app.post('/api/create'); // create user to db
 
 app.get('/api/singup'); // returns errors
 app.post('/api/singup'); // Verify user from db

//  Admin
 app.get('/api/admin/:id'); 
 app.post('/api/admin/:id'); // 
 app.update('/api/admin/:id');
 app.delete('/api/admin/:id');

//  User
 app.get('/api/user/:id'); // get 
 app.post('/api/user/:id');
 app.update('/api/user/:id');
 app.delete('/api/user/:id');

 //  Friends
 app.get('/api/friends/:id');
 app.post('/api/friends/:id');
 app.update('/api/friends/:id');
 app.delete('/api/friends/:id');

//  Messages
 app.get('/api/message/:id');
 app.post('/api/message/:id');
 app.update('/api/message/:id');
 app.delete('/api/message/:id');

 */
 