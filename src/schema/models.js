const mongoose = require('mongoose');
module.exports = function(mongoUrl){
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoUrl);

    const User = mongoose.model('User', {
        age: Number, 
        gender: { type: String, required: false },
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
        friendCount: {
            following: Number,
            follow: Number,
        },
        messagesCount: Number,
        imagePathName: String
    });

    const Friends = mongoose.model('Friends', {
        ownerId: { type: String, required: true },
        friendId: { type: String, required: true },
        status: { type: String, required: true }, // follow, notfollo, deleted
        timestamp: {
            created: String,
            lastUpdated: String,
        },
        username: { type: String, required: false, unique: false },
        friendData: {type: Object, require: true}
    });

    const Messages = mongoose.model('Messages', {
        ownerId: { type: String, required: true },
        friendId: { type: String, required: true },
        status: { type: String, required: true }, //read, unread, deleted
        description: String,
        timestamp: {
            created: String,
            sent: String,
            read: String,
        }
    });

    const Days = mongoose.model('Days', {
        'day': String,
        'names': Array,
        status: String,
        statusBar: Number,
        class: String,
        state: String,
        checkmark: String,
        space: Number,
        statusBtn: String
    });

    return {
        User,
        Friends,
        Messages,
        Days
    };

};
