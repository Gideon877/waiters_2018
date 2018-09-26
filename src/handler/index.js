const _ = require("lodash");
const moment = require("moment");
const data = require('../lib/days');

const Models = require('./../schema/models');
const models = Models(process.env.MONGO_DB_URL || 'mongodb://localhost/waiters', { useNewUrlParser: true });

const General = require("../lib/general");
const shift = ['Monday', 'Friday', 'Sunday']
const USER = require('./waiter/friends');
const User = USER(models);

const FRIENDS = require('../handler/waiter/friends');
const Friends = FRIENDS(models)

const getUserFriendsByUsername = (params) => {
  let { user, userFriends, users } = params;
  return new Promise(resolve => {
    Friends.getNames(users, userFriends)
    .then(result => {
        General.getRandomUserProfile(result).then(userFriends => {
          _.sortBy(userFriends, ['firstName']);
          resolve(userFriends);
        })
      })
    })
}

async function king() {
  let users = await Friends.getUsers();
  let user = await Friends.getUserByUsername({username: 'gideon877'});
  let userFriends = await Friends.getFriendsById(user._id);
  let abc = await General.getPeopleToConnect({users, userId: user._id})
  let boChomi = await getUserFriendsByUsername({ user, userFriends, users })

  console.log(abc.length, user._id, '----w---', boChomi);



}

king();