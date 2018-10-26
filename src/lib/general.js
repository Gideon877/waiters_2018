'use strict'
const moment = require('moment');
const _ = require('lodash');
const { Other } = require('../lib/constants').ImagePath;
/**
 * @param  {Array} users
 * @param  {Array} days
 */

const getDays = (users, days) => {
    if (_.isEmpty(users) || _.isEmpty(days)) return null;
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
    if (_.isEmpty(user) || _.isEmpty(data)) return null;
    return new Promise(resolve => {
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

const resetWeekStatus = params => {
    // reset user week input statuses
    let { user, days } = params || undefined;
    return new Promise (resolve => {
        days.forEach(function(element) {
            var userNames = element.names;
            element.class = '';
            element.statusBtn = ''
            element.checkmark = '';
            element.state = '';
            _.remove(userNames, function(n) {
                return n == user.firstName || 'admin';
            });
        })
        resolve(days)
    });
}


const updateShiftDays = (params) => {
    // update user shift
    return new Promise((resolve, reject) => {
        let { user, shift } = params;
        user.days = shift;
        user.timestamp.lastUpdated = moment.utc();
        user.save((err, saved)=> {
            (err) ? (reject(err)) : (resolve(saved));
        });
    });
}

const updateShiftWithUser = params => {
    // update user shift and User
    let { users } = params;
    return new Promise(resolve => {
        updateShiftDays(params).then( user => {
            _.remove(users, function (element) {
                return element._id == user._id;
            });
            users.push(user);
            resolve({users, user});
        })
    });
}

/**
 * @param  {Array} users
 */
const getRandomUserProfile = users => {
    // get user a new profile picture
    return new Promise((resolve) => {
        users.forEach( x => {
            const max = Other.length - 1;
            let index = _.random(1, max);
            if (!x.imagePathName) { 
                x.imagePathName = Other[index];
            };
        });
        users = _.sortBy(users, ['firstName']);
        resolve(users)
    });
}


/**
 * @param  {Object} params
 * @param  {String} params.users
 * @param  {String} params.userId
 * @description get user people s/he may know
 */
const getPeopleToConnect = params => { 
    let {users, userId } = params
    return new Promise(resolve => {
        _.remove(users, function(x){
            return  _.isEqual(userId, x._id);
        })
        // .then(() => {
        //     await getRandomUserProfile(users )
        // });
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

const getFilteredDays =  params => {
    let { users, days, user } = params;
    if (_.isEmpty(users) || _.isEmpty(days) || !user) return null;
    return new Promise((resolve, reject) => {
        getDays(users, days).then(x => {
            getStatus(x, user).then(
                userDays => {
                    resolve(userDays)
                }
            )
        }).catch(e => reject(e));
    });
}

const getFriends = () => {
    return new Promise((resolve, reject)=> { 
        Friends.find({}, (err, friends) => {
            if (err) return reject(err);
            return resolve(friends);
        })
    })
}

const getUsers = () => {
    return new Promise((resolve, reject)=> { 
        Users.find({isUserActive: true}, (err, users) => {
            if (err) return reject(err);
            return resolve(users);
        })
    })
};
/**
 * @param  {String} id
 */
const getUserById = id => {
    return new Promise((resolve, reject)=> { 
        Users.findOne({_id: id}, (err, user) => {
            if (err) return reject(err);
            return resolve(user);
        })
    })
};
/**
 * @param  {Object} params
 * @param  {Array} params.data
 * @param  {Array} params.shift
 * @param  {Object} params.user
 * @param  {Array} params.users
 */
const prepareWaiterHomePayload = async (params) => {
    let { user } = params || req.session.user;
    return new Promise ((resolve, reject) => {
        resetWeekStatus(params).then(
            getFilteredDays(params).then( days => {
                resolve({
                    user, days, messageCount: 1, friendsCount: 1
                });
            })
        ).catch( e => reject(e));
    });
};

const filterFriendsByStatus = params => {
    //Get bunch of all friend
}

module.exports = {
    adminData,
    getUserById,
    getDays,
    getStatus,
    updateShiftDays,
    getRandomUserProfile,
    getPeopleToConnect,
    getFriends,
    updateShiftWithUser,
    getUsers,
    prepareWaiterHomePayload
    // getFilteredDays,
    // resetWeekStatus,
};




const findAnotherBoyfriend = () => {
    return new Promise((resolve, reject) => {
        try {
            if (bf == 'Working, smart, handsome' && !Thabang) {
                resolve(bf);
            } else {
                findAnotherBoyfriend();
            }
        } catch (error) {
            return new Error('Boyfriend not defined');
        }
    })
}