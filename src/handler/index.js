const _ = require("lodash");
const moment = require("moment");
const data = require('../lib/days');
const FriendStatuses = require('../lib/constants').FriendStatuses;
const Models = require('./../schema/models');
const models = Models(process.env.MONGO_DB_URL || 'mongodb://localhost/waiters', { useNewUrlParser: true });

const API = require('../api/general')

const General = require("../lib/general");
const shift = ['Monday', 'Friday', 'Sunday']
const USER = require('./waiter/friends');
const User = USER(models);

const FRIENDS = require('../handler/waiter/friends');
const Friends = FRIENDS(models)
const Api = API(models)

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
  const getParams = {
    id: user._id,
    status: FriendStatuses.Pending
  }

  let userFriends = await Friends.getFriendsByIdAndStatus(getParams);
  let abc = await General.getPeopleToConnect({users, userId: user._id})
  let boChomi = await getUserFriendsByUsername({ user, userFriends, users })

  
  // console.log('------', userFriends);

  let myUser = await Api.findAllFriend();
  console.log(myUser.length);
  let m = [];
  myUser.forEach(x => {
    if (x.username == 'amanda') {
      m.push(x )

    }
    // return x.username == 'amanda'
  });

  // let bg = await Api.findUserFriendsByOwnerId('5b7ba122af9c9d06e5cac95d') //Api.findAllFriend();
  console.log('aaaz', m);
  


}

king();