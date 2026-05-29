const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    verified: {
        type: Boolean,
        default: false
    },
    otpHash: {
        type: String,
        select: false
    },
    otpExpiresAt: {
        type: Date,
        select: false
    }
},
    {timestamps: true}
);

module.exports = mongoose.model('User', userSchema);