"use strict"
const data = require('../lib/days')
const _ = require('lodash');
const General = require("../lib/general");

module.exports = function(models) {
    const User = models.User;
    const getFriends = models.Friends;
    const getMessages = models.Messages;
    
    const getAdminScreen = (req, res, done) => {
        (req.session && req.session.user) ?
        (User.find({}, async (err, users) => { 
            if (err) return done(err);
            let user = await General.adminData;
            await General.resetWeekStatus(data, user);
            let days = await General.getDays(users, data);
            days = await General.getStatus(days, {firstName: 'admin'});
            const getData = {
                user,
                days
            };
            // console.log(days[0].names);
            
            res.render('admin/home', getData);

        })) : res.redirect('/login');
    };

    const getHomeScreen = (req, res, done) => {
            (req.session && req.session.user) 
            ? res.redirect('/login')
            : res.render('home');
    };

    const getLoginScreen = (req, res, done) => {
        if (req.sessin && req.session.user) {
            let params = {
                username: req.session.user.id,
                id: req.session.user.id,
                res, req
            };
            return getUser(params);
        } else {
            res.render('signup/login')
        }
    };

    const getWaiterSettingsScreen = (req, res, done) => {
        (req.session && req.session.user) 
            ? (User.findOne({
                _id: req.params.id
            }, function(err, user) {
                if (err) return done(err);
                res.render('waiter/account', { user });
            })
            )
            : res.render('home');
    }

    const getRegistrationScreen = (req, res, done) => {
        (req.session && req.session.user) 
        ? res.redirect('/login')
        : res.render('signup/register');
    };

    function getUser(params) {
        // console.log(params);
        
        let { username, id, res } = params;
        (username === 'admin') 
        ? res.redirect('/admin/' + id)
        : res.redirect('/waiters/' + id)
    }

    return {
        getAdminScreen,
        getHomeScreen,
        getLoginScreen,
        getRegistrationScreen,
        getWaiterSettingsScreen
    }
}