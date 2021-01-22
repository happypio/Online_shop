const mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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


/* Encrypting user password */
userSchema.pre('save', async function (next){
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPasswd = await bcrypt.hash(this.password, salt);
        this.password = hashedPasswd;
    }
    catch(error){
        next(error);
    }
})

mongoose.model('User', userSchema);