'use strict'

const _ = require('lodash');
const bcrypt = require('bcrypt');
const moment = require("moment");
const API = require("../api/general");

module.exports = function(models) { 
    const Api = API(models);

    //register
    const signupScreen = (req, res, done) => {
        let { user } = req.session || undefined;
        (_.isEmpty(user)) ? res.render('register', { }) : res.redirect('/waiter/' + user._id);
    };

    const signup = (req, res, done) => {
        let data = req.body || {};
        let { username } = data;

       try {
        const userExist = await Api.isUserAlreadyExist(username);
        const checkData = await Api.isDataValid(data);

        if (userExist) {
            req.flash('error', 'Username Already Exists');
            res.render('register', {});
        }

        if (!checkData) {
            req.flash('error', 'Missing required fields');
            res.render('register', {});
        }

        let newUser = await Api.createUser(data); //returns user object;
        req.session.user = newUser;
        
        (_.isEmpty(newUser)) ? res.render('register', { }) : res.redirect('/login');

       } catch (error) {
        req.flash('error', error);
        return done(error);
       }
    }

    //login

    const loginScreen = (req, res, done) => {
        let { user } = req.session || undefined;
        (_.isEmpty(user)) ? res.render('login', { }) : res.redirect('/waiter/' + user._id);
    }

    const login = (req, res, done) => {
        const {  username, password } = req.body || {};

        let userExist = await Api.isUserAlreadyExist(username);
        let user = await Api.findUserByUsername(username);
        
        if (!userExist) {
            req.flash('error', 'Username does not exist');
            res.render('login', {});
        }

        let isPasswordCorrect = await Api.decryptPassword({password, user});
        if (!isPasswordCorrect) { 
            req.flash('error', 'Incorrect Password');
            res.render('login', {});
        };

        req.session.user = user;
        
        (_.isEmpty(user)) ? res.render('login', { }) : res.redirect('/waiter/' + user._id);
        

    }

    //waiter

    const waiterScreen = (req, res, done) => {
        let { user } = req.session || undefined;
        let { id } = req.params;
        if (!user) { user = Api.findUserById(id) };
        let getDays = {};
        let getFriends = {}
        
        const payload = {
            user,
            getDays,
            getFriends
        };
        res.render('waiter', payload);
    }

    const submitShift = (req, res, done) => {
        let { shift } = req.body || {};
        
        res.render('waiter', { });
    }

    //admin

    const home = (req, res, done) => {
        res.render('admin', { });

    }

    // Friends

    const showAllFriends = (req, res, done) => {
        res.render('friends', { });

    }

    const deleteFriend = (req, res, done) => {

    }

    const getFriendProfile = (req, res, done) => {

    }

    const updateFriendship = (req, res, done) => {

    }

    const addNewFriend = (req, res, done) => {

    }

    return {

    }

}