const mongoose = require('mongoose');
module.exports = function(mongoUrl){
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoUrl);

    const Waiter = mongoose.model('Waiter', {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: false },
        cell: { type: Number, required: false },
        username: { type: String, required: true, unique: false },
        password: { type: String, required: true, bcrypt: true },
        days: { type: Array, required: false },
        timestamp: {
            created: String,
            lastUpdated: String,
            lastSeen: String,
        },
    });

    return {
        Waiter
    };

};
