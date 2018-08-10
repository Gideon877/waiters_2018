"use strict";

const moment = require('moment');
const bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports = function(models) {
    const mongoDB = models.Waiter;
    const admin = (req, res, done) => {
        (req.session && req.session.user) ? res.redirect('/') : getWaiters({ res, req, done });
    }

    function getWaiters(argument) {

    }
    return {
        admin
    }
}