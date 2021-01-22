const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    /* If we need to store info about whether the user is admin or not,
    maybe it's better to simply have a Boolean instead of String? */
    user: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
})

mongoose.model('User', userSchema);