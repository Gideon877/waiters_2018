const _ = require("lodash");
const moment = require("moment");
// const days = require('../lib/days');
var friends = [
  {
    owner: "123",
    friend: '124',
    days: []
  },
  {
    owner: "123",
   friend: '125',
    days: []
  },
  {
    owner: "124",
   friend: '125',
    days: []
  }
];

var users = [
  {
    firstName: "Thabang",
    _id: '123',
    days: []
  },
  {
    firstName: "Amanda",
    _id: '124',
    days: []
  },
  {
    firstName: "Viwe",
    _id: '125',
    days: []
  }
];

let user = {
  _id: '123',
  firstName: 'Thabang'
}

// console.log(friends);

const { Images } = require('../lib/constants').ImagePath; //['amanda.jpg', 'viwe.jpg','john.jpg', 'rachel.png'];

const max = Images.length - 1;

users.forEach(function(e){
  let index = _.random(1, max)
  e.imagePathName = 'king'
  if (!e.imagePathName) {
    e.imagePathName = Images[index];

  }
})
users = _.sortBy(users, ['firstName'])

console.log("-------------------------------------------------------");

// _.remove(friends, function(x){
//   return x.owner !== user._id;
// })

console.log(users);
