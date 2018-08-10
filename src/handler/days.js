'use strict'

module.exports.getAllUsers = (mongoDB) => {
    return new Promise((resolve, reject) => {
        mongoDB.find({}, (err, dt) => {
            if (err) reject(err);
            resolve(dt);
        });
    })
}

