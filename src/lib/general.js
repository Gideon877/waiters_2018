'use strict'
const moment = require('moment');
const _ = require('lodash');
const { Other } = require('../lib/constants').ImagePath;
/**
 * @param  {Array} users
 * @param  {Array} days
 */

const getDays = (users, days) => {
    return new Promise(resolve => {
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
        resolve(days);
    })
}


/**
 * @param  {Array} data
 * @param  {Object} user
 * @param  {String} user.firstName
 */
const getStatus = (data, user) => {
    return new Promise((resolve) => {
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
        resolve(data);
    });
};

/**
 * @param  {Array} data
 * @param  {Object} user
 * @param  {String} user.firstName
 */

const resetWeekStatus = (data, user) => {
    
    return new Promise ((resolve) => {
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
        resolve(data)
    });
}

const updateShiftDays = (params) => {
    return new Promise((resolve, reject) => {
        let { user, shift } = params;
        user.days = shift;
        user.timestamp.lastUpdated = moment.utc();
        user.save((err, saved)=> {
            (err) ? (reject(err)) : (resolve(saved));
        });
    });
}

/**
 * @param  {Array} users
 */
const getRandomUserProfile = users => {
    return new Promise((resolve) => {
        users.forEach( x => {
            const max = Other.length - 1;
            let index = _.random(1, max);
            if (!x.imagePathName) { 
                x.imagePathName = Other[index];
            };
        });
        resolve(users)
    });
}


/**
 * @param  {Array} users
 * @param  {String} userId
 */
const getPeopleToConnect = (users, userId) => { 
    return new Promise(resolve => {
        _.remove(users, function(x){
            return x._id == userId;
        });
        resolve(users);
    });
};

const adminData = {
    firstName: 'admin',
    username: 'admin',
    days: ['Sunday', 'Friday', 'Monday'],
}


/**
 * @param  {Object} user
 * @param  {String} user.firstName
 * @param  {Array} users
 * @param  {Array} days
 */

const getFilteredDays =  (users, days, user) => {
    return new Promise((resolve, reject) => {
        getDays(users, days).then(x => {
            getStatus(x, user).then(
                userDays => {
                    resolve(userDays)
                }
            )
        })
    });
}


module.exports = {
    adminData,
    getDays,
    getStatus,
    getFilteredDays,
    resetWeekStatus,
    updateShiftDays,
    getRandomUserProfile,
    getPeopleToConnect
};