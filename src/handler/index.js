const _ = require("lodash");
const moment = require("moment");
// const days = require('../lib/days');
var days = [
  { day: "Monday", names: ["Thabang", "Viwe"], status: "" },
  { day: "Wednesday", names: ["Amanda", "Viwe"], status: "" },
  { day: "Thursday", names: ["Amanda"], status: "" },
  { day: "Friday", names: [], status: "" }
];

var user = [
  {
    name: "Thabang",
    days: ["Monday", "Wednesday", "Friday"]
  },
  {
    name: "Amanda",
    days: ["Wednesday", "Monday"]
  }
];

user.forEach(function(o) {
  const userName = o.name;

  days.forEach(function(e) {
    const weekday = e.day;
    e.timestamp = moment().format();
    e.lastSeen = moment(moment.utc()).from(moment(new Date()));

    const arrNames = e.names;
    const userDays = o.days;
    _.remove(arrNames, function(name) {
      return name === userName;
    });
    
    userDays.forEach(function(params) {
      if (weekday == params) {
        arrNames.push(userName);
      }
    });
  });
});

console.log("-------------------------------------------------------");

console.log(days);
