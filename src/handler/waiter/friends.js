"use strict";

const moment = require('moment');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const data = require('../../lib/days');
const General = require('../../lib/general');
const { FriendStatuses } = require('../../lib/constants');

/**
 * C - Adding New Friends for both
 * R - View All connected friends
 * U - Remove friend from friend list using status
 * D - remove connection
 */


module.exports = function(models) {
    const Users = models.User;
    const Friends = models.Friends;
    const Messages = models.Messages;

    const getFriendsScreen = async (req, res, done) => {
        try {
            let user = req.session.user || await getUserByUsername({username: 'gideon877'});
            // console.log('getFriendsScreen User', user);

            // get all connected Friends
            // get all pending Friends
            
            let users = await getUsers();

            let userFriends = await getFriendsById(user.id);
            let connected = await getConnectedFriendsByUserId(user.id);
            let pending = await getPendingFriendsByUserId(user.id);


            console.log('getFriendsScreen', connected, user);

            let userMessages = await getMessages();
          
            userFriends = await General.getRandomUserProfile(userFriends);
            pending = await General.getRandomUserProfile(pending);
            connected = await General.getRandomUserProfile(connected);
             
            let newUsers = await General.getPeopleToConnect({users , userId: user._id});
            let usersToConnect = await General.getRandomUserProfile(newUsers, req.params.id);

            let filteredUsersToConnect = _.differenceBy(usersToConnect, userFriends, 'username');
            //    console.log('usersToConnect', usersToConnect.length, 'filteredUsersToConnect', filteredUsersToConnect.length, 'userFriends', userFriends);
               
            const getData = {
                user,
                messageCount: userMessages.length,
                userFriends,
                friendsCount: pending.length,
                usersToConnect: filteredUsersToConnect,
                pending
            };
            res.render('waiter/friends', getData);
        } catch (error) {
            console.log(error);
            req.flash('error', error);
            res.render('waiter/friends');
            // res.redirect('/login')
        }
    }



   
    const getUserScreen = (req, res, done) => {
        // (req.session && req.session.user) 
        // ? (
            Users.findOne({
                _id: req.params.id
            }, function(err, user) {
                if (err) return done(err);
                let { messages, friends } = user || {};
                let { connected } = friends || [];
                
                const getData = {
                    user,friend,
                    messageCount: messages.length,
                    userFriends: _.sortBy(connected, ['name']),
                    friendsCount: friends.incoming.length,
                };

                // console.log(getData);
                
                res.render('waiter/users', getData);
            })
        //     )
        // : res.redirect('/login')
    };

    const addFriend = async (req, res, done) => {
        let friendId = req.params.id;
        let user  = req.session.user || await getUserByUsername({username: 'gideon877'});
        let friend = await getUserById(friendId);
        await createFriendConnection(user, friend);

        let userFriends = await getFriends();
        let users = await getUsers();
        userFriends = await getNames(users, userFriends);
        
        _.remove(userFriends, function(x){
            return x.ownerId != user._id;
        });
        
        userFriends = await General.getRandomUserProfile(userFriends);
        userFriends = _.sortBy(userFriends, ['firstName']);

        console.log(user, 'adding body', friend);
        

        let { messages, friends } = user || {};
        let { connected } = friends || [];
        
        const getData = {
            user,
            userFriends,
            messageCount: 1,
            userFriends: _.sortBy(connected, ['name']),
            friendsCount: 1,
        };
        console.log('addFriend getData', getData);
        res.render('waiter/users', getData);
    }

    const viewMoreDetails = async (req, res, done) => {
        // if (req.session && req.session.user) {
            let friend, getParams;
            console.log('----- ------- --- viewMoreDetails ------- -----');
            
            try {
                friend = await getUserById(req.params.id);
                console.log('Friend:', friend);
                getParams = {
                    user: await getUserByUsername({username: 'gideon877'}),
                    friend
                };
                console.log(getParams);
                res.render('waiter/user', getParams);
            } catch (error) {
                console.log(error);
                res.render('waiter/user');
            }
        // } else {
        //     res.redirect('/login');
        // }
    }

    const getUsers = () => {
        return new Promise((resolve, reject)=> { 
            Users.find({isUserActive: true }, (err, users) => {
                if (err) return reject(err);
                return resolve(users);
            })
        })
    };
// db.bios.find( { Country: { $ne: "Country1" } } )
    const findActiveUsers = username => {
        return new Promise((resolve, reject)=> { 
            Users.find({ isUserActive: true , username: {$nin: ['admin', username]}}, (err, users) => {
                if (err) return reject(err);
                return resolve(users);
            })
        })
    };

    const getUserById = (id) => {
        return new Promise((resolve, reject)=> { 
            Users.findOne({_id: id}, (err, user) => {
                if (err) return reject(err);
                return resolve(user);
            })
        })
    };

/**
 * @param  {Object} user
 * @param  {String} user.username
 */
    const getUserByUsername = user => {
        return new Promise((resolve, reject)=> { 
            Users.findOne(user, (err, user) => {
                if (err) return reject(err);
                return resolve(user);
            })
        })
    };

    const getFriends = () => {
        return new Promise((resolve, reject)=> { 
            Friends.find({}, (err, friends) => {
                if (err) return reject(err);
                return resolve(friends);
            })
        })
    }

/**
 * @param  {String} id
 */
    const getFriendsById = id => {
        return new Promise((resolve, reject)=> { 
            Friends.find({ ownerId: id}, (err, friends) => {
                if (err) return reject(err);
                return resolve(friends);
            })
        })
    };

    /**
     * @param  {Object} params
     * @param  {String} params.id
     * @param  {String} params.status
     */
    const getFriendsByIdAndStatus = (params) => {
        let { id, status } = params;
        return new Promise((resolve, reject)=> { 
            Friends.find({ ownerId: id, status}, (err, friends) => {
                if (err) return reject(err);
                return resolve(friends);
            })
        })
    }

      /**
     * @param  {Object} params
     * @param  {String} params.id
     * @param  {String} params.status
     */
    const getConnectedFriendsByUserId = id => {
        return new Promise((resolve, reject)=> { 
            Friends.find({ ownerId: id, status: FriendStatuses.connected}, (err, friends) => {
                if (err) return reject(err);
                return resolve(friends);
            })
        })
    }

      /**
     * @param  {Object} params
     * @param  {String} params.id
     * @param  {String} params.status
     */
    const getPendingFriendsByUserId = id => {
        return new Promise((resolve, reject)=> { 
            Friends.find({ ownerId: id, status: FriendStatuses.Pending}, (err, friends) => {
                if (err) return reject(err);
                return resolve(friends);
            })
        })
    }

    const getMessages = () => {
        return new Promise((resolve, reject)=> { 
            Messages.find({}, (err, messages) => {
                if (err) return reject(err);
                return resolve(messages);
            })
        })
    }

    // const module.exports.findUsers ()
      /**
     * @param  {Object} user
     * @param  {String} user._id
     * 
     * @param  {Object} friend
     * @param  {String} friend._id
     * @param  {Object} friend.timestamp
     * @param  {String} friend.timestamp.lastSeen
     */
    const createFriendConnection = (user, friend) => {
        return new Promise((resolve, reject) => {
            Friends.create({
                ownerId: user._id,
                friendId: friend._id,
                status: FriendStatuses.Pending,
                username: friend.username,
                timestamp: {
                    created: moment.utc() || new Date(),
                    lastSeen: friend.timestamp.lastSeen || moment().format('lll')
                },
                friend
            }, (err, newConnection) => {
                if (err) return reject(err);
                console.log('User created', newConnection);
                
                return resolve(newConnection);
            });
        });
    }

/**
 * @param  {Array} users
 * @param  {Array} friends
 */
    const getNames = (users, friends) => {
        return new Promise(resolve => {
            users.forEach(function(e){
                friends.forEach(function(o){
                    if (e._id == o.friendId) {
                        o.firstName = e.firstName;
                        // o.lastSeen = moment(e.timestamp.lastSeen).from(moment(moment.utc())) ;
                    }
                })
            });
            resolve(friends);
        })
    }

    return {
        getFriendsScreen,
        getUserScreen,
        viewMoreDetails,
        addFriend,
        getUsers,
        getFriends,
        getUserByUsername,
        getUserById,
        getMessages,
        getNames,
        getFriendsById,
        getFriendsByIdAndStatus,
        getConnectedFriendsByUserId,
        getPendingFriendsByUserId,findActiveUsers
    }
}