const asyncHandler = require('express-async-handler');
const Course = require('../models/courseModel');

// @desc   Get all courses data
// @route  GET /api/courses/
// @access Public
const getAllCourses = asyncHandler(async (req, res) => {
    const course = await Course.find({});
    res.status(200).json(course);
});

// @desc   Add new course
// @route  POST /api/courses/
// @access Private (super admins and admins only)
const addCourse = asyncHandler(async (req, res) => {
    // check for admin's role
    if(req.admin.authority !== 'super admin' && req.admin.authority !== 'owner' && req.admin.authority !== 'admin') {
        res.status(400);
        throw new Error('Not authorized to add course');
    }
    const {
        code,
        name,
        desc,
        category,
        skills,
        prerequisiteCourses,
        partner,
        moneyPaid,
        toPay,
        location,
        startDate,
        endDate
    } = req.body;
    // check for course
    const courseExists = await Course.findOne({code});
    if(courseExists){
        res.status(400);
        throw new Error('Course already exists');
    }
    // create course
    const course = await Course.create({
        admin: req.admin.id,
        code,
        name,
        desc,
        category,
        skills,
        prerequisiteCourses,
        partner,
        moneyPaid,
        toPay,
        location,
        startDate,
        endDate,
    });
    if(course){
        res.status(200).json({
            admin: course.admin,
            code: course.code,
            name: course.name,
            desc: course.desc,
            category: course.category,
            skills: course.skills,
            prerequisiteCourses: course.prerequisiteCourses,
            enrolledStudents: [],
            partner: course.partner,
            moneyPaid: course.moneyPaid,
            toPay: course.toPay,
            location: course.location,
            startDate: course.startDate,
            endDate: course.endDate,
            visited: []
        });
    } else {
        res.status(400);
        throw new Error('Invalid course data');
    }
});

// @desc   Get specific course data
// @route  GET /api/courses/:id
// @access Public
const getCourse = asyncHandler(async (req, res) => {
    // check if course exists
    const course = await Course.findById(req.params.id);
    if(!course){
        res.status(400);
        throw new Error('Course does not exists');
    }
    res.status(200).json(course);
});

// @desc   Update course data
// @route  PATCH /api/courses/:id
// @access Private (super admins and admins only)
const updataCourse = asyncHandler(async (req, res) => {
    // check for admin's role
    if(req.admin.authority !== 'super admin' && req.admin.authority !== 'owner' && req.admin.authority !== 'admin') {
        res.status(400);
        throw new Error('Not authorized to add course');
    }
    // check if course exists
    const course = await Course.findById(req.params.id);
    if(!course){
        res.status(400);
        throw new Error('Course does not exists');
    }
    await Course.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(await Course.findById(req.params.id));
});

// @desc   Delete course
// @route  DELETE /api/courses/:id
// @access Private (super admins and admins only)
const deleteCourse = asyncHandler(async (req, res) => {
    // check for admin's role
    if(req.admin.authority !== 'super admin' && req.admin.authority !== 'owner' && req.admin.authority !== 'admin') {
        res.status(400);
        throw new Error('Not authorized to add course');
    }
    // check if course exists
    const course = await Course.findById(req.params.id);
    if(!course){
        res.status(400);
        throw new Error('Course does not exists');
    }
    await Course.remove();
    res.status(200).json({
        message: "Course deleted",
        id: req.params.id
    });
});

// @desc   Get frequently visited course
// @route  GET /api/courses/frequently-visited
// @access Public
const frequentlyVisited = asyncHandler(async (req, res) => {

});

// @desc   Get recommended courses based on logged student
// @route  GET /api/courses/recommended
// @access Public
const recommended = asyncHandler(async (req, res) => {

});


module.exports = { 
    getAllCourses,
    addCourse, 
    getCourse, 
    updataCourse, 
    deleteCourse,
    frequentlyVisited,
    recommended 
};