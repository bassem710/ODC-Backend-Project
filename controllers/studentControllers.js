const asyncHandler = require('express-async-handler');
const Student = require('../models/studentModel');
const Course = require('../models/courseModel');

// @desc   Get all students
// @route  GET /api/students/
// @access Private (ODC only)
const getStudents = asyncHandler(async (req, res) => {
    if(req.admin.authority !== "super admin" && req.admin.authority !== "owner") {
        res.status(400);
        throw new Error('Not authorized to view admins data');
    }
    const students = await Student.find({});
    res.status(200).json(students);
});

// @desc   Get one student
// @route  GET /api/students/:id
// @access Private (ODC and logged student)
const getOneStudent = asyncHandler(async (req, res) => {
    if(req.admin.authority !== "super admin" && req.admin.authority !== "owner") {
        res.status(400);
        throw new Error('Not authorized to view admins data');
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
        progress
    } = req.body;
    // check for student
    const studentExists = Student.find({email: email});
    if(studentExists){
        console.log(req.body);
        throw new Error('Studdent already exist');
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
        joinedCourses,
        skills
    });
    if(student){
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
            token: generateToken(student._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid student data');
    }
});

module.exports = { getStudents, getOneStudent, addStudent };