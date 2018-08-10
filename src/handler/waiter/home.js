"use strict";

const moment = require('moment');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const data = require('../../lib/days');
module.exports = function(models) {
    const mongoDB = models.Waiter;
    const updateUser = async (req, res, done) => {
        const { shift } = req.body;
        (req.session && req.session.user) ?
        (mongoDB.find({}, (err, users) => {
            if (err) return done(err);
            let user = _.find(users, function(element) {
                return element._id == req.params.id
            });
            name(data, user);
           
            if (_.isEmpty(shift) || !_.isEmpty(shift) && shift.length > 3 || shift.length < 3) {
                req.flash('error', 'Please select 3 days!') && 
                res.redirect('/waiters/' + user.id);
            } else {
                const updatedUser = updateUserDays(user, shift);
                _.remove(users, function (element) {
                    return element._id == req.params.id
                });
                users.push(updatedUser);
                const days = filterDay(users, data);
                let uniqDays = removeNames(days);
                let b = getStatus(uniqDays, updatedUser);
                res.render('waiter/home', { user: updatedUser, days:b })
            }
        })) : res.redirect('/login');
    }

    const getWaiterScreen = (req, res, done) => {
        (req.session && req.session.user) ?
        (mongoDB.find({}, (err, users) => {
            if (err) return done(err);
            let user = _.find(users, function(element) {
                return element._id == req.params.id
            });
            name(data, user);
            let days = filterDay(users, data);
            let uniqDays = removeNames(days);  
            let b = getStatus(uniqDays, user);
            res.render('waiter/home', { user, days:b })
        })) : res.redirect('/login');
    }

    function updateUserDays(user, days) {
        user.days = days;
        user.timestamp.lastUpdated = moment().utc('MMMM Do YYYY, h:mm:ss a');
        user.save();
        return user;
    }

    function filterDay(users, obj) {
        users.forEach(function(key) {
            let days = key.days;
            let firstName = key.firstName;
            days.forEach(function(e) {
                let weekDay = _.find(obj, ['day',e]);
                let names = weekDay.names;
                names.push(firstName);
            });
        });
        return data;
    }

    function getStatus(data, newUser) {
        data.forEach( function(element){
            element.statusBar = element.names.length;
            if (element.statusBar >= 3) {
                element.statusBtn = 'disabled';
                element.class = 'positive';
                element.status = 'Fully Booked';
                element.checkmark = 'checkmark';
            } else {
                element.class = 'warning'
                element.state = '';
                element.status = 'Available';
            }
            _.find(element.names, function(x){
                if (x == newUser.firstName) {
                    element.state = 'Booked';
                    element.checkmark = 'checkmark';
                    element.statusBtn = 'checked';
                };
            })
        });
        return data;
    };
    
    const removeNames = array => {
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            const uniqArr = removeDuplicates(element.names);
            array[i].names = uniqArr;
        };
        return array;
    }

    function removeDuplicates(arr){
        let unique_array = []
        for(let i = 0;i < arr.length; i++){
            if(unique_array.indexOf(arr[i]) == -1){
                unique_array.push(arr[i])
            }
        }
        return unique_array
    };

    function name(array, newUser) {
        array.forEach(function(element) {
            var userNames = element.names;
            element.class = '';
            element.statusBtn = ''
            element.checkmark = '';
            element.state = '';
            _.remove(userNames, function(n) {
                return n == newUser.firstName
            });
        })
    }

    return {
        getWaiterScreen,
        updateUser
    }
}
