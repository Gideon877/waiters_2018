'use strict'

const _ = require('lodash');
const bcrypt = require('bcrypt');
const moment = require("moment");
const Models = require("../schema/models");
const models = Models(
  process.env.MONGO_DB_URL || "mongodb://localhost/waiters",
  { useNewUrlParser: true }
);

const API = require("./general");
const Api = API(models);

module.exports = function(models) { 

    const createNewUser = async (req, res) => {
        const data = req.body || {};
        const {  username } = data;
        return await Api.isUserAlreadyExist(username)
        .then((result) => {
            if (!result) {
                if (!result) FailToExecute('User Already Exists');
            }
        })
        .then(() => {
            return Api.isDataValid(data).then((result) => {
                if (!result) FailToExecute('Invalid Data');
            })
        })
        .then(() => {
            return Api.createUser(data).then(result => { 
                return result
            })
        })
        .catch(FailToExecute);
    }



    function FailToExecute(err) {
        // req.flash('error', err);
        // res.render('signup/register');
        return {}
    }
    
    

    return {
        createNewUser,
    }
};


