"use strict";

const moment = require("moment");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const data = require("../../lib/days");
const General = require("../../lib/general");

module.exports = function(models) {
    const mongoDB = models.User;
    const admin = async (req, res, done) => {
        if (req.session && req.session.user) {
            let days = await General.getDays(users, data);
            days = await General.getStatus(days, user);
            res.redirect("/");
            
        } else {
            getWaiters({ res, req, done });
        }
    };

  function getWaiters(argument) {}
  return {
    admin
  };
};
