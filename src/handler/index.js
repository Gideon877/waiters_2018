const _ = require("lodash");
const moment = require("moment");
const data = require('../lib/days');

const Models = require('./../schema/models');
const models = Models(process.env.MONGO_DB_URL || 'mongodb://localhost/waiters', { useNewUrlParser: true });

const General = require("../lib/general");
const shift = ['Monday', 'Friday', 'Sunday']
const USER = require('./waiter/friends');
const User = USER(models);



async function king() {
  let myUsers = await User.getUsers();
  let admin = await User.getUserByUsername({username: 'admin'})
  // let viwe = myUsers._.get('')
  // console.log(viwe);
  var friends = [
    {
      name: 'king', age: 5
    },
    {
      name: 'mike', age: 50
    },
    {
      name: 'joy', age: 9
    }
  ]

  var baNa = [
    {
      name: 'joy', age: 9
    },
    {
      name: 'mike', age: 50
    },
    {
      name: 'dineo', age: 5
    }
  ];
friends.forEach(function(e){
    _.remove(baNa, function(x){
      if (x.name == e.name) {
        
      }
    })
    
  })
  // console.log(data);

  // let newStatus = await General.getPeopleToConnect(myUsers, '5b7949cf29b1201429dfccc5')
  console.log( '-------------f-------------------------------------------------');
  let days = await General.getFilteredDays(myUsers, data, {})
  console.log(myUsers.length)
  
  let bb = _.forEach(myUsers, function(x) {
    if (x.gender === undefined) {
      x.gender = 'Other'
    }
    console.log('sf sf ', x.gender);

    
  })
  console.log(bb)
  



  // console.log('---==w', myUsers.length);
  
  
}

king()


// // const days = require('../lib/days');
// var friends = [
//   {
//     owner: "123",
//     friend: '124',
//     days: []
//   },
//   {
//     owner: "123",
//    friend: '125',
//     days: []
//   },
//   {
//     owner: "124",
//    friend: '125',
//     days: []
//   }
// ];

// var users = [
//   {
//     firstName: "Thabang",
//     _id: '123',
//     days: []
//   },
//   {
//     firstName: "Amanda",
//     _id: '124',
//     days: []
//   },
//   {
//     firstName: "Viwe",
//     _id: '125',
//     days: []
//   }
// ];

// let user = {
//   _id: '123',
//   firstName: 'Thabang'
// }

// // console.log(friends);

// const { Images } = require('../lib/constants').ImagePath; //['amanda.jpg', 'viwe.jpg','john.jpg', 'rachel.png'];

// const max = Images.length - 1;

// users.forEach(function(e){
//   let index = _.random(1, max)
//   e.imagePathName = 'king'
//   if (!e.imagePathName) {
//     e.imagePathName = Images[index];

//   }
// })
// users = _.sortBy(users, ['firstName'])

// console.log("-------------------------------------------------------");

// // _.remove(friends, function(x){
// //   return x.owner !== user._id;
// // })

// console.log(users);
