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
        enum: ["frontend", "backend"]
    },
    joinedCourses: {
        type: [{
            courseID: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                unique: true
            }, 
            progress: {
                type: String,
                enum: ["waiting response", "Criteria Not Met", "Passed Interview", "Failed Interview", "Invited", "attended"],
                default: "waiting response"
            }
        }]
    },
    skills: {
        type: [String],
        default: []
    }
}, {timestamps: true});

module.exports = mongoose.model("Student", studentSchema);