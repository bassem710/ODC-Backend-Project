const mongoose = require('mongoose');

const enrolledStudents = mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please add enrolled student ID"],
        ref: 'Student'
    },
    progress: {
        type: String,
        enum: ["Not Invited", "Criteria Not Met", "Passed Interview", "Failed Interview", "Invited"],
        default: "Not Invited"
    }
});

const courseSchema = mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please add admin's ID"],
        ref: 'Admin' 
    },
    code:{
        type: String,
        required: [true, "Please add course code"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Please add course name"],
        unique: true
    },
    desc: {
        type: String,
        required: [true, "Please add course description"]
    },
    category: {
        type: String,
        required: [true, "Please add course category"],
        default: "Not categorized"
    },
    skills: {
        type: Array,
        required: [true, "Please add course skills"]
    },
    prerequisiteSkills:{
        type: Array,
        default: []
    },
    prerequisiteCourses:{
        type: Array,
        default: []
    },
    enrolledStudents: {
        type: [enrolledStudents],
        default: []
    },
    partner: {
        type: String,
        required: [true, "Please add course partner"]
    },
    moneyPaid: {
        type: Number,
        required: [true, "Please add money paid"],
        default: 0
    },
    toPay: {
        type: Number,
        required: [true, "Please add money to pay"],
        default: 0
    },
    location: {
        type: String,
        required: [true, "Please add course location"]
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    visited: {
        type: [Date],
        default: []
    }
});

module.exports = mongoose.model("Course", courseSchema);