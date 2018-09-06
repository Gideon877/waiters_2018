"use strict";

const moment = require('moment');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const data = require('../../lib/days');
const General = require('../../lib/general');
const { FriendStatuses} = require('../../lib/constants');


module.exports = function(models) {
    const Users = models.User;
    const Friends = models.Friends;
    const Messages = models.Messages;

    const getFriendsScreen = async (req, res, done) => {
        if (req.session && req.session.user) {
            let users = await getUsers();
            let userFriends = await getFriends();
            let userMessages = await getMessages();

            let user = req.session.user;

            userFriends = await getNames(users, userFriends);
            
            _.remove(userFriends, function(x){
                return x.ownerId != user._id;
            });

            userFriends = await General.getRandomUserProfile(userFriends);
            userFriends = _.sortBy(userFriends, ['firstName']);

            let newUsers = await General.getPeopleToConnect(users , req.params.id);
            let usersToConnect = await General.getRandomUserProfile(newUsers, req.params.id);
            
            console.log('userFriends', userFriends);
            console.log('------------------------------------------------------');
            console.log('usersToConnect', usersToConnect);
            
            const getData = {
                user,
                messageCount: userMessages.length,
                userFriends: userFriends,
                friendsCount: userFriends.length,
                usersToConnect
            };
            res.render('waiter/friends', getData);
        } else {
            res.redirect('/login')
        }
    }
   
    const getUserScreen = (req, res, done) => {
        (req.session && req.session.user) 
        ? (Users.findOne({
                _id: req.params.id
            }, function(err, user) {
                if (err) return done(err);
                let { messages, friends } = user || {};
                let { connected } = friends || [];
                // connected.forEach((dog) => {
                //     dog.when = moment(dog.timestamp).from(moment(moment.utc()));
                // });
                const getData = {
                    user,friend,
                    messageCount: messages.length,
                    userFriends: _.sortBy(connected, ['name']),
                    friendsCount: friends.incoming.length,
                };
                res.render('waiter/users', getData);
            }))
        : res.redirect('/login')
    };

    const addFriend = async (req, res, done) => {
        let friendId = req.params.id;
        let { user } = req.session;
        let friend = await getUserById(friendId);
        console.log(user, 'adding body', friend);
        
        await createFriendConnection(user, friend);

        let { messages, friends } = user || {};
        let { connected } = friends || [];
        // connected.forEach((dog) => {
        //     dog.when = moment(dog.timestamp).from(moment(moment.utc()));
        // });
        const getData = {
            user,
            friend,
            messageCount: 1,
            userFriends: _.sortBy(connected, ['name']),
            friendsCount: 1,
        };
        console.log('addFriend getData', getData);
        res.render('waiter/users', getData);
    }

    const viewMoreDetails = async (req, res, done) => {
        if (req.session && req.session.user) {
            let friend = await getUserById(req.params.id);
            const getParams = {
                user: req.session.user,
                friend
            };
            res.render('waiter/user', getParams);
        } else {
            res.redirect('/login');
        }
    }

    const getUsers = () => {
        return new Promise((resolve, reject)=> { 
            Users.find({}, (err, users) => {
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
                timestamp: {
                    created: moment.utc() || new Date(),
                    lastSeen: friend.timestamp.lastSeen || moment().format('lll')
                },
                friend
            }, function(err, newConnection){
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
        getMessages
    }
}