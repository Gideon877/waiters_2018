"use strict";

const moment = require('moment');
const bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports = function(models) {
    const mongoDB = models.Waiter;
    const validate = (req, res, done) => {
        const body = req.body;
        (req.session && req.session.user) ? (res.redirect('/')) : createUser(body, { res, req, done });
    }

    function createUser(body, argument) {
        let { res, req, done } = argument;
        let { username, firstName, lastName, cell, email, password } = body;
        const getUser = {
            firstName: _.capitalize(firstName),
            lastName: _.capitalize(lastName),
            email,
            cell,
            password,
            username,
            timestamp: {
                created: moment().utc('MMMM Do YYYY, h:mm:ss a'),
                lastUpdated: moment().utc('MMMM Do YYYY, h:mm:ss a'),
                lastSeen: moment().utc('MMMM Do YYYY, h:mm:ss a'),
            }, 
        }
        
        mongoDB.findOne({ username }, (err, user) => {
            if (err) return done(err);
            (user) ? 
                (
                    req.flash('error', 'Username already exist!') &&
                    res.render('signup/register')
                ) : 
                (
                    mongoDB.create(getUser, (err, newUser) => {
                        if (err) return done(err);
                        bcrypt.genSalt(15, function(err, salt) {
                            if (err)
                                return done(err);
                            bcrypt.hash(password, salt, function(err, hash) {
                                if (err)
                                    return done(err);
                                newUser.password = hash;
                                req.session.user = newUser;
                                console.log('newUser', newUser);
                                newUser.save();
                                done();
                            });
                        });
                        (newUser && newUser.username === 'admin') ? 
                        (
                            res.redirect('/admin/'+ newUser._id)
                        ) : (
                            res.redirect('/waiters/' + newUser._id)
                        )
                    })
                )
        });
    }
    return {
        validate
    }
}