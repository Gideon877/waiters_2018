"use strict";

const moment = require('moment');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const data = require('../../lib/days');
const General = require('../../lib/general');
const FRIENDS = require('../waiter/friends');

module.exports = function(models) { 
    const Friends = FRIENDS(models);
    const mongoDB = models.User;
    const getWaiterScreen = async (req, res, done) => {
        if (req.session && req.session.user) { 
            try {
                let user = await Friends.getUserById(req.params.id);
                let users = await Friends.getUsers();
                const getData = await General.prepareWaiterHomePayload({users, days: data, user});
                
                res.render('waiter/home', getData);
            } catch (error) {
                req.flash('error', error);
                res.render('waiter/home');
            }
        } else {
            res.redirect('/login');
        };
    }

    const updateUserDays = async (req, res, done) => {
        const { shift } = req.body;
        if (req.session && req.session.user) {
            if (_.isEmpty(shift) || !_.isEmpty(shift) && shift.length > 3 || shift.length < 3) {
                req.flash('error', 'Select three prefered working days, and press save button to submit') &&
                res.redirect('/waiters/' + req.params.id);
            } else {
                try {
                    let users = await Friends.getUsers();
                    let user = await Friends.getUserById(req.params.id);
                    let obj = await General.updateShiftWithUser({user, users, shift});
                    const getData = await General.prepareWaiterHomePayload({ users: obj.users, user: obj.user, days: data});
    
                    res.render('waiter/home', getData);
                    
                } catch (error) {
                    req.flash('error', error);
                    res.render('waiter/home');
                }
            }
            
        } else {
            req.flash('error', 'Failed to update days');
            res.redirect('/login');
        }
    }

    // work in progress
    // const updateUserProfile = (req, res, done) => {
    //     let { firstName, lastName, email, cell, username, password } = req.body;
    //     mongoDB.findOne({_id: req.params.id}, (err, user) => {
    //         if (err) return done(err);
    //         let updatedUser = {
    //             firstName: _.capitalize(firstName),
    //             lastName: _.capitalize(lastName),
    //             email,
    //             cell,
    //             username,
    //             password,
    //             timestamp: {
    //                 lastUpdated: moment.utc()
    //             }
    //         };
    //         res.render('waiter/account', { user: updatedUser });
    //     })
    // }
    // ----------------------------------------------------------------------

    return {
        getWaiterScreen,
        updateUserDays,
        // updateUserProfile
    }
}
