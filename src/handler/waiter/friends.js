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

    const getScreen = async (req, res, done) => {
        if (req.session && req.session.user) {
            let users = await getUsers();
            let userFriends = await getFriends();
            let userMessages = await getMessages();

            let user = _.find(users, function(element) {
                return element._id == req.params.id
            });

            userFriends = getNames(users, userFriends);
            
            _.remove(userFriends, function(x){
                return x.ownerId != user._id;
            });

            userFriends = General.getRandomUserProfile(userFriends);
            userFriends = _.sortBy(userFriends, ['firstName']);

            let newUsers = General.getPeopleToConnect(users , req.params.id);
            let usersToConnect = General.getRandomUserProfile(newUsers, req.params.id);
            
            
            const getData = {
                user,
                messageCount: userMessages.length,
                userFriends: userFriends,
                friendsCount: userFriends.length,
                usersToConnect
            };
            console.log('getdata', getData);

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
                connected.forEach((dog) => {
                    dog.when = moment(dog.timestamp).from(moment(moment.utc()));
                });
                console.log(user);
                
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
        let {id, friendId } = req.params || undefined;
        let user = await getUserById(id);
        let friend = await getUserById(friendId);
        createFriendConnection(user, friend);

        let { messages, friends } = user || {};
                let { connected } = friends || [];
                connected.forEach((dog) => {
                    dog.when = moment(dog.timestamp).from(moment(moment.utc()));
                });
                console.log(user);
        const getData = {
            user,
            friend,
            messageCount: messages.length,
            userFriends: _.sortBy(connected, ['name']),
            friendsCount: friends.incoming.length,
        };
        res.render('waiter/users', getData);
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
        Friends.create({
            ownerId: user._id,
            friendId: friend._id,
            status: FriendStatuses.Pending,
            timestamp: {
                created: moment.utc(),
                lastSeen: friend.timestamp.lastSeen || moment().format('lll')
            },
            friend
        }, function(err){
            if (err) return done(err)
        });
    }


    function getNames(users, friends) {
        users.forEach(function(e){
            friends.forEach(function(o){
                if (e._id == o.friendId) {
                    o.firstName = e.firstName;
                    o.lastSeen = moment(e.timestamp.lastSeen).from(moment(moment.utc())) ;
                }
            })
        })
        return friends;
    }

    return {
        getScreen,
        getUserScreen,
        addFriend
    }
}