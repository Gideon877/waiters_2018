'use strict'
const moment = require('moment');
const _ = require('lodash');

/**
 * @param  {Array} users
 * @param  {Array} days
 */

module.exports.getDays = (users, days) => {
    users.forEach(element => {
        const userName = element.firstName;
        const userDays = element.days;
        days.forEach(element => {
            const weekday = element.day;
            const arrNames = element.names;
            element.timestamp = moment().format();
            element.lastSeen = moment(moment.utc()).from(moment(new Date()));
            _.remove(arrNames, name => {
                return name === userName;
              });
            userDays.forEach(params => {
                if (weekday == params) {
                    arrNames.push(userName);
                }
            });
        });
    });
    return days;
}


/**
 * @param  {Array} data
 * @param  {Object} user
 * @param  {String} user.firstName
 */
module.exports.getStatus = (data, user) => {
    data.forEach( function(element){
        element.statusBar = element.names.length;
        if (element.statusBar >= 3) {
            element.statusBtn = 'disabled';
            element.class = 'positive';
            element.status = 'Fully Booked';
            element.checkmark = 'checkmark';
            element.space = 'Not Available';
        } else {
            element.class = 'warning'
            element.state = '';
            element.status = 'Available';
            element.space =  3 - element.statusBar;
        }
        _.find(element.names, function(x){
            if (x == user.firstName) {
                element.state = 'Booked';
                element.checkmark = 'checkmark';
                element.statusBtn = 'checked';
            };
        })
    });
    return data;
};

/**
 * @param  {Array} data
 * @param  {Object} user
 * @param  {String} user.firstName
 */

module.exports.resetWeekStatus = (data, user) => {
    data.forEach(function(element) {
        var userNames = element.names;
        element.class = '';
        element.statusBtn = ''
        element.checkmark = '';
        element.state = '';
        _.remove(userNames, function(n) {
            return n == user.firstName
        });
    })
}

module.exports.updateShiftDays = (params) => {
    let { user, shift } = params;
    user.days = shift;
    user.timestamp.lastUpdated = moment.utc();
    user.save();
    return user;
}