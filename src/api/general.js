"use strict";
const moment = require('moment');
const bcrypt = require('bcrypt');
const _ = require('lodash');
// const { Friend } = require('./app');
const { ImagePath, FriendStatuses, BCryptRounds } = require('../lib/constants');

module.exports = function(models) {
    const Users = models.User;
    const Friends = models.Friends;
    const Messages = models.Messages;
    const Days = models.Days;
    /**
     * @param  {String} password
     */
    const hashPassword = param => {
        const password = _.isString(param) ? param : param.toString();
        return bcrypt.genSalt(BCryptRounds)
            .then(salt => {
                return bcrypt.hash(password, salt).then((result) => {
                    return result;
                });
            })
            .catch((err) => {
                return err;
            });
    };

    /**
     * @param  {Object} param
     * @param  {String} param.password
     * @param  {String} param.user
     */
    const decryptPassword = param => {
        let { password, user } = param || {};
        return bcrypt.compare(password, user.password)
        .then((result) => {
            return result;
        }).catch((err) => {
            return err;
        });

    };

    /**
     * @param  {String} gender
     */
    const setImagePathName = (gender) => {
        const type = (gender) ? gender : 'Other';
        const Images = ImagePath[type];
        const max = Images.length - 1;
        return Images[_.random(1, max)]
    };
    /**
     * @param  {} object
     * @description 
     */
    const isDataValid = (object) => {
        let check;
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                check = !_.isEmpty(object[key]);
                console.log(object[key], 'check', !_.isEmpty(object[key]))
            }
            // console.log(check, 'object.hasOwnProperty(key)', object.hasOwnProperty(key))
            if (!check) {
                return false;
            };
        }
        return check;
    }

    /** Friends  */ 
        // ----- READ -----
            /**
             * @author Thabang Gideon Magaola
             * @description Find all friends
             */
            const findAllFriend = () => {
                return Friends.find({})
                    .then(friends => { friends})
                    .catch(err => { err})
            };
            
            /**
             * @author Thabang Gideon Magaola
             * @param  {Object} params
             * @param  {String} params.id
             * @param  {String} params.username
             */
            const getFriendByOwnerIdAndUsername = (params) => {
                return Friends.findOne(params)
                    .then(friends => {return friends})
                    .catch(err => {return err})
            };
            
            /**
             * @param  {String} ownerId
             * @description Find all user friends by user id.
             */
            const findFriendsByOwnerId = (ownerId) => {
                return Friends.find({ ownerId })
                    .then(friends => {return friends})
                    .catch(err => {return err})
            };
            /**
             * @param  {String} username
             * @description Find all friends provided username is connected to where user is not the owner of the relationship. Opposite of findUserFriendsByOwnerId.
             */
            const findFriendsByUsername = (username) => {
                return Friends.find({ username })
                    .then(result => resolve(result))
                    .catch(err => {return err})
            };

            /**
             * @param  {Object} params
             * @param  {String} params.ownerId
             * @param  {String} params.friendId
             * @requires ownerId
             * @requires friendId
             */
            const findOneConnectionByIds = (params) => {
                return Friends.findOne(params)
                    .then(connection => { return connection})
                    .catch(err => {return err})
            }

            const areUsersConneted = (params) => {
                return Friends.findOne(params)
                .then(result => {return !_.isEmpty(result) })
                .catch(err => {return err});
            };

        // ----- CREATE -----
        /**
         * 
         * @param {*} data
         * @description Checks if the connection exists. Create New connection - With Pending status 
         * @requires data.ownerId
         * @requires data.friendId
         * @requires data.Status
         * @requires data.FriendData
         */
            const createFriend = (data) => {
                return Friends.create(data)
                .then(connection => { return connection})
                .catch(err => {return err})
            }

            const isFriendDataValid = (data) => {
                const { ownerId, friendId , friendData } = data || {};
                if (!_.isString(ownerId)) {
                    return false;
                };

                if (!_.isString(friendId)) {
                    return false;
                };

                if (_.isEmpty(friendData)) {
                    return false;
                };
                
                return true;
            };

            /**
             * @param  {Object} data
             * @param  {String} data.ownerId
             * @param  {String} data.friendId
             * @requires data.ownerId
             * @requires data.friendId
             */
            const createFriendConnection = async (data) => {
                let { friendId } = data || {};
                let checkIfUsersAreConnected = await areUsersConneted(data);
                
                if (checkIfUsersAreConnected) {
                    return await findOneConnectionByIds(data);
                };
                
                let user = await findUserById(friendId);
                data.friendData = user;
                data.username = user.username;
                data.status = FriendStatuses.Pending;
                let isValid = await isFriendDataValid(data);
                
                if (isValid) {
                    data.timestamp = {
                        created: moment.utc() || new Date(),
                    }
                    return await createFriend(data);
                } else {
                    return {};
                }
            } 


        // ----- DELETE -----
            /**
             * @param  {String} params
             * @param  {String} params.ownerId
             * @param  {String} params.friendId
             * @requires ownerId
             * @requires friendId
             */
            const deleteFriendByIds = (params) => {
                return new Promise((resolve, reject) => {
                    Friends.remove(params).then((result) => {
                        resolve(result);
                    }).catch((err) => {
                        reject(err);
                    });
                })
            }
            // const deleteFriendById = () => {

            // }
        // ----- UPDATE -----
            /**
             * @param  {Object} filter
             * @param  {Object} filter.friendId
             * @param  {Object} filter.ownerId
             * @param  {Object} update
             * 
             */
            // const updateFriendByUsername = (filter, update) => {
            //     return new Promise((resolve, reject) => {
            //         Friends.updateOne(filter, update).then((result) => {
            //             resolve(result);
            //         }).catch((err) => {
            //             reject(err);
            //         });
            //     })

            // }

            /**
             * @param  {Object} filter
             * @param  {Object} filter.friendId
             * @param  {Object} filter.ownerId
             * @param  {Object} update
             * @param  {Object} update.status
             * 
             */
            const updateFriendByStatus = (filter, status) => {
                return new Promise((resolve, reject) => {
                    Friends
                    .updateOne(filter, { status })
                    .then(result => 
                        resolve(result)
                    )
                    .catch((err) => {
                        reject(err);
                    });
                })

            }
            const updateFriendById = () => { };

    /** Users  */

        // ----- READ -----
            /**
             * @param  {String} username
             * @description Username - current logged in User
             */
            const findActiveUsers = username => {
                return Users
                .find({ isUserActive: true , username: { $nin: ['admin', username]}})
                .then(users => users)
                .catch(err =>  err);
            };

            const findAllUser = () => {
                return Users.find({}).then((users) => {
                    return users;
                }).catch((err) => {
                    return err;
                });
            };
            /**
             * @param  {string} id
             */
            const findUserById = (id) => {
                return Users.findOne({_id: id}).then(user => {
                    return user;
                }).catch((err) => {
                    return err;
                });
            };
            const findUserByUsername = (username) => {
                return Users.findOne({username}).then(user => {
                    return user;
                }).catch((err) => {
                    return err;
                })
            };
            const findUsersByFirstName = (firstName) => {
                return Users.findOne({firstName}).then(user => {
                    return user;
                }).catch((err) => {
                    return err;
                })
            };
            /**
             * @param  {String} username
             * @description returns true if user exist or false if user doesn't
             */
            const isUserAlreadyExist = (username) => {
                return Users.findOne({username}).then(user => {
                    if (_.isEmpty(user)) { 
                        return false;
                    } else { return true }
                }).catch((err) => {
                    return err;
                })
            };

        // ----- CREATE -----
            /**
             * @param  {Object} params
             * @param  {Object} params.firstName
             * @param  {Object} params.lastName
             * @param  {Object} params.username
             * @param  {Object} params.password
             */
            const createUser = async params => {
                params.password = await hashPassword(params.password);
                params.imagePathName = await setImagePathName(params.gender);
                params.isUserActive = true;
                params.timestamp = {
                    created: moment.utc(),
                    lastUpdated: moment.utc(),
                    lastSeen: moment.utc(),
                };
                return Users.create(params).then(user => {
                    return user;
                }).catch((err) => {
                    return err;
                });
            };

        // ----- DELETE -----
            const deleteUserByUsername = (username) => {
                return Users.remove({username}).then(result => {
                    return result;
                }).catch((err) => {
                    return err;
                });
            }
            const deleteUserById = (id) => {
                return Users.remove({id}).then(result => {
                    return result;
                }).catch((err) => {
                    return err;
                });
            }
        // ----- UPDATE -----
            const updateUser = (params) => {
                return Users.save(params).then(result => {
                    return result;
                }).catch((err) => {
                    return err;
                });
            }

            const updateUserDays = (params) => {
                let {username, days} = params;
                return Users.findOneAndUpdate({username}, {days})
                .then(result => result)
                .then(async (user) => {
                    return await findUserByUsername(user.username);
                })
                .catch(error => error);
            }
            

    /** Days  */ 

    var data = {
        days: ['Monday', 'Tuesday', 'Wednesday'] 
    };


    const getDays = () => {
        return Days
        .find()
        .then(days => days)
        .catch(error => error)
    }

    // const updateWaiterDays = () => {
    //     return findAndUpdate();
    // }


    /** Messages  */ 
   


    return { 
        findAllFriend,
        getFriendByOwnerIdAndUsername,
        findFriendsByUsername,
        findFriendsByOwnerId,
        findUserById,
        findOneConnectionByIds,
        isFriendDataValid,
        areUsersConneted,
        createFriendConnection,
        deleteFriendByIds,
        updateFriendByStatus,

        createUser,
        hashPassword,
        decryptPassword,
        setImagePathName,
        isDataValid,
        isUserAlreadyExist,
        findUserByUsername,

        getDays,
        findActiveUsers,
        updateUserDays
    }
};


/**
 * Friends
 * Messages
 * User - Home
 */


//  Waiter Home Page 
//   - User
//   - Waiter/s Days
//   - get friends and messages count

// user
// friend