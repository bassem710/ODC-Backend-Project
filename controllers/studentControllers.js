const asyncHandler = require("express-async-handler");
const Student = require("../models/studentModel");
const bcrypt = require('bcryptjs')
const Course = require("../models/courseModel");

// @desc   Get all students
// @route  GET /api/students/
// @access Private (ODC only)
const getStudents = asyncHandler(async (req, res) => {
    if (
        req.admin.authority !== "super admin" &&
        req.admin.authority !== "owner"
    ) {
        res.status(400);
        throw new Error("Not authorized to view admins data");
    }
    if(req.body.course){
        const students = await Student.find({joinedCourses: {$elemMatch: {courseCode: req.body.course}}}).select('-password');
        res.status(200).json(students);
        return;
    }
    const students = await Student.find({});
    res.status(200).json(students);
});

// @desc   Get one student
// @route  GET /api/students/:id
// @access Private (ODC and logged student)
const getOneStudent = asyncHandler(async (req, res) => {
    if (
        req.admin.authority !== "super admin" &&
        req.admin.authority !== "owner"
    ) {
        res.status(400);
        throw new Error("Not authorized to view admins data");
    }
    const students = await Student.findById(req.params.id);
    res.status(200).json(students);
});

// @desc   Add one student
// @route  POST /api/students
// @access Public
const addStudent = asyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        specialty,
        joinedCourses,
        progress,
    } = req.body;
    // check for student
    const studentExists = await Student.findOne({ email: email });
    if (studentExists) {
        throw new Error("Studdent already exist");
    }
    // joined courses
    const joinedC = [];
    // skills
    const skills = [];
    // joined courses loop
    for (let i=0 ; i<joinedCourses.length; i++) {
        const current = await Course.findOne({code: joinedCourses[i]});
        if(progress[i] === "attended") {
            skills.push(...current.skills);
        }
        joinedC.push({courseCode: joinedCourses[i], progress: progress[i]});
        await Course.findOneAndUpdate({code: joinedCourses[i]}, {enrolledStudents: {email: email, progress: progress[i]}});
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // create student
    const student = await Student.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        gender,
        specialty,
        joinedCourses: joinedC,
        skills,
    });
    if (student) {
        res.status(200).json({
            _id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            phone: student.phone,
            gender: student.gender,
            specialty: student.specialty,
            joinedCourses: student.joinedCourses,
            skills: student.skills,
        });
    } else {
        res.status(400);
        throw new Error("Invalid student data");
    }
});

module.exports = { getStudents, getOneStudent, addStudent };
