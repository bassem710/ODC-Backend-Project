const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    disabled: {
        type: Boolean,
        default: false
    },
    authority: {
        type: String,
        required: [true, 'Please add a admin authority'],
        enum: ["super admin","admin","viewer"]
    },
    firstName: {
        type: String,
        required: [true, 'Please add a first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add a last name']
    },
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    }
}, {timestamps: true});

module.exports = mongoose.model('Admin', adminSchema);