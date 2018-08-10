"use strict"
const data = require('../lib/days')
const _ = require('lodash');

module.exports = function(models) {
    const getAdminScreen = (req, res, done) => {
        (req.session && req.session.user) 
            ? res.render('admin/home')
            : res.redirect('/login')
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

    const getRegistrationScreen = (req, res, done) => {
        (req.session && req.session.user) 
        ? res.redirect('/login')
        : res.render('signup/register');
    };

    function getUser(params) {
        let { username, id, res, req } = params;
        (username === 'admin') 
        ? res.redirect('/admin/' + id)
        : res.redirect('/waiters/' + id)
    }

    return {
        getAdminScreen,
        getHomeScreen,
        getLoginScreen,
        getRegistrationScreen,
    }
}