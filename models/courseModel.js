const mongoose = require('mongoose');

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
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student'}],
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
    startDate: {
        type: Date,
        required: [true, "Please add course start date"]
    },
    endDate: {
        type: Date,
        required: [true, "Please add course end date"]
    },
    visited: {
        type: [Date],
        default: []
    }
});

module.exports = mongoose.model("Course", courseSchema);