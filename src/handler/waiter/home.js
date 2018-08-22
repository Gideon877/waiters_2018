"use strict";

const moment = require('moment');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const data = require('../../lib/days');
const General = require('../../lib/general');


module.exports = function(models) { 
    const mongoDB = models.User;
    const getWaiterScreen = (req, res, done) => {
        (req.session && req.session.user) ?
        (mongoDB.find({}, (err, users) => { 
            if (err) return done(err);
            let user = _.find(users, function(element) {
                return element._id == req.params.id
            });
            General.resetWeekStatus(data, user);
            let days = General.getDays(users, data);
            days = General.getStatus(days, user);
            const getData = {
                user,
                days,
                messageCount: 1,
                userFriends: [],
                friendsCount: 0
            };
            res.render('waiter/home', getData);

        })) : res.redirect('/login');
    }

    const updateUserDays = (req, res, done) => {
        const { shift } = req.body;
        (req.session && req.session.user) ?
        (mongoDB.find({}, (err, users) => { 
            if (err) return done(err);
            let user = _.find(users, function(element) {
                return element._id == req.params.id
            });
            if (_.isEmpty(shift) || !_.isEmpty(shift) && shift.length > 3 || shift.length < 3) {
                req.flash('error', 'Select three prefered working days, and press save button to submit') &&
                res.redirect('/waiters/' + user.id);
            } else {
                General.resetWeekStatus(data, user);
                user = General.updateShiftDays({shift, user});
                _.remove(users, function (element) {
                    return element._id == req.params.id
                });
                users.push(user);
                let days = General.getDays(users, data);
                days = General.getStatus(days, user);
                const getData = {
                    user,
                    days,
                    messageCount: 1,
                    userFriends: [],
                    friendsCount: 0
                };
                res.render('waiter/home', getData);
            }
        })) : res.redirect('/login');
    }

    const updateUserProfile = (req, res, done) => {
        let { firstName, lastName, email, cell, username, password } = req.body;
        mongoDB.findOne({_id: req.params.id}, (err, user) => {
            if (err) return done(err);
            let updatedUser = {
                firstName: _.capitalize(firstName),
                lastName: _.capitalize(lastName),
                email,
                cell,
                username,
                password,
                timestamp: {
                    lastUpdated: moment.utc()
                }
            };
            res.render('waiter/account', { user: updatedUser });
        })
    }

    return {
        getWaiterScreen,
        updateUserDays,
        updateUserProfile
    }
}
