const mongoose = require('mongoose');
module.exports = function(mongoUrl){
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoUrl);

    const User = mongoose.model('User', {
        age: Number,
        firstName: { type: String, required: true, unique: false },
        lastName: { type: String, required: true, unique: false },
        email: { type: String, required: false },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, bcrypt: true },
        days: { type: Array, required: false },
        timestamp: {
            created: String,
            lastUpdated: String,
            lastSeen: String,
        },
        isUserActive: Boolean,
    });

    const Friends = mongoose.model('Friends', {
        ownerId: { type: String, required: true },
        friendId: { type: String, required: true },
        status: { type: String, required: true },
        timestamp: {
            created: String,
            lastUpdated: String,
        }
    });

    const Messages = mongoose.model('Messages', {
        ownerId: { type: String, required: true },
        friendId: { type: String, required: true },
        status: { type: String, required: true },
        description: String,
        timestamp: {
            created: String,
            sent: String,
            read: String,
        }
    })

    return {
        User,
        Friends,
        Messages
    };

};
