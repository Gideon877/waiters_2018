"use strict";
const moment = require('moment');
const bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports = function(models) {
    const mongoDB = models.User;
    const userLogin = (req, res, done) => {
        const body = req.body;
        (req.session && req.session.user) ? res.redirect('/') : verifyUser(body, { res, req, done });
    }
    function verifyUser (body, argument) {
        let { username, password } = body;
        let { req, res, done } = argument;

        mongoDB.findOne({ username }, (err, user) => {
            if (err) return done(err);

            (!user) ? ( 
                req.flash('errorTitle', 'Login failed!') &&
                req.flash('error', 'Username does not exist!') && 
                res.render('signup/login')
            ) : 
            ( 
                bcrypt.compare(password, user.password, function(err, result) {
                    if (err)
                        return done(err);
                    if (result) {
                        req.session.user = user;
                        (user && user.username === 'admin') ? 
                        (
                            res.redirect('/admin/' + user.id)
                        ) : (
                            res.redirect('/waiters/' + user.id)
                        )
                    } else {
                        req.flash('errorTitle', 'Login failed!')
                        req.flash('error', 'Incorrect Password');
                        res.render('signup/login');
                    }
                })
            )
        })
    }


    return {
        userLogin
    }
}