const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { usersRoles } = require('../config/options');

const userSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: false
    },
    phone: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: [usersRoles.SCP, usersRoles.FARMER],
        default: usersRoles.SCP,
        required: true,
      },
    village: {
        type: String,
        required: false
    },
    cropType: {
        type: String,
        required: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
}, { timestamps: true })

const User = mongoose.model('User', userSchema);
module.exports = User;
