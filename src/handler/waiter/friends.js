"use strict";

const moment = require('moment');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const data = require('../../lib/days');
module.exports = function(models) {
    const mongoDB = models.User;
    const getScreen = (req, res, done) => {
        (req.session && req.session.user) 
        ? (mongoDB.findOne({
                _id: req.params.id
            }, function(err, user) {
                if (err) return done(err);
                let { messages, friends } = user;
                let { connected } = friends;
                let currentTime = moment.utc();
                
                connected.forEach((dog) => {
                    dog.when = moment(dog.timestamp).from(moment(currentTime));
                });
                
                const getData = {
                    user,
                    messageCount: messages.length,
                    userFriends: _.sortBy(connected, ['name']),
                    friendsCount: friends.incoming.length,
                };
                res.render('waiter/friends', getData);
            }))
        : res.redirect('/login')
    };

    const getUserScreen = (req, res, done) => {
        (req.session && req.session.user) 
        ? (mongoDB.findOne({
                _id: req.params.id
            }, function(err, user) {
                if (err) return done(err);
                let { messages, friends } = user;
                let { connected } = friends;
                let currentTime = moment.utc();
                
                connected.forEach((dog) => {
                    dog.when = moment(dog.timestamp).from(moment(currentTime));
                });
                console.log(user);
                
                const getData = {
                    user,
                    messageCount: messages.length,
                    userFriends: _.sortBy(connected, ['name']),
                    friendsCount: friends.incoming.length,
                };
                res.render('waiter/users', getData);
            }))
        : res.redirect('/login')
    };
    return {
        getScreen,
        getUserScreen
    }
}