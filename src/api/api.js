'use strict'

const _ = require('lodash');
const bcrypt = require('bcrypt');
const moment = require("moment");
const API = require("./general");

module.exports = function(models) { 
    const Api = API(models);

    const registerNewUser = async (data) => {
        // const data = {} ; //req.body || {};
        const {  username } = data;

         // returns true or false
        let userExist = await Api.isUserAlreadyExist(username);
        if (userExist) {
            return FailToExecute('User Already Exists');
        };
        
        // returns true or false
        let checkData = await Api.isDataValid(data);
        console.log('checkData:', checkData)
        if (!checkData) {
            return FailToExecute('Invalid Data');
        };

        let newUser = await Api.createUser(data);
        return newUser;

    }

    const login = async (data) => {
        // const data = {} ; //req.body || {};
        const {  username, password } = data;
        let userExist = await Api.isUserAlreadyExist(username);
        let user = await Api.findUserByUsername(username);
        
        if (!userExist) {
            return FailToExecute('User does not exist');
        }

        let isPasswordCorrect = await Api.decryptPassword({password, user});
        if (!isPasswordCorrect) { 
            return FailToExecute('Incorrect Password'); 
        };
       
        return user;
    };


    function returnToRegistration() {
        
    };

    function FailToExecute(err) {
        console.log('FailToExecute', err)
        // req.flash('error', err);
        // res.render('signup/register');
        return {err}
    }
    
    

    return {
        registerNewUser, login
    }
};


