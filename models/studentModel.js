const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add student first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add student last name']
    },
    email: {
        type: String,
        required: [true, 'Please add student username'],
        unique: true
    },
    phone: {
        type: Number,
        required: [true, "Please add student phone number"]
    },
    password: {
        type: String,
        required: [true, 'Please add student password']
    },
    gender: {
        type: String,
        required: [true, "Please add student gender"],
        enum: ["male", "female"]
    },
    specialty: {
        type: String,
        required: [true, "Please add student specialty"],
    },
    joinedCourses: {
        type: [{
            courseCode: {
                type: String,
                required: true,
                unique: true
            }, 
            progress: {
                type: String,
                enum: ["waiting response", "Criteria Not Met", "Passed Interview", "Failed Interview", "In progress", "attended"],
                default: "waiting response"
            },
            quiz: {
                type: Number,
                min: 0,
                max: 100
            },
            project: {
                type: Number,
                min: 0,
                max: 100
            }
        }]
    },
    skills: {
        type: [{
            type: String,
            unique: true
        }],
        default: []
    }
}, {timestamps: true});

module.exports = mongoose.model("Student", studentSchema);