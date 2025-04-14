const mongoose = require('mongoose');
const Schema = require.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtStrategy = require('../config/jwt-config.js');

const UserSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    allFriendsId: {
        type: [String],
    },
    allPinsId: {
        type: [String],
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;