const asyncHandler = require('express-async-handler');
const { exists } = require('../models/courseModel');
const Course = require('../models/courseModel');
const Student = require('../models/studentModel');

// @desc   Get all courses data
// @route  GET /api/courses/
// @access Public
const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({});
    const data = courses;
    data.forEach( course => {
        course.courseProgress = progressPerentage(course.startDate, course.endDate);
    });
    res.status(200).json(data);
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
    // pre skills
    const preSkills = [];
    for(let i=0 ; i < prerequisiteCourses.length ; i++ ){
        const c = await Course.findOne({code: prerequisiteCourses[i]});
        preSkills.push(...c.skills);
    }
    // create course
    const course = await Course.create({
        admin: req.admin.id,
        code,
        name,
        desc,
        category,
        skills,
        prerequisiteSkills: preSkills,
        prerequisiteCourses,
        partner,
        moneyPaid,
        toPay,
        location,
        startDate,
        endDate,
        courseProgress: 0
    });
    if(course){
        res.status(200).json({
            admin: course.admin,
            code: course.code,
            name: course.name,
            desc: course.desc,
            category: course.category,
            skills: course.skills,
            prerequisiteSkills: course.prerequisiteSkills,
            prerequisiteCourses: course.prerequisiteCourses,
            enrolledStudents: [],
            partner: course.partner,
            moneyPaid: course.moneyPaid,
            toPay: course.toPay,
            location: course.location,
            startDate: course.startDate,
            endDate: course.endDate,
            visited: [],
            courseProgress: progressPerentage(course.startDate, course.endDate)
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
    const data = course;
    data.courseProgress = progressPerentage(course.startDate, course.endDate);
    res.status(200).json(data);
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
    const FRONTEND = ["CS111", "FR111", "FR112", "FR113"];
    const BACKEND = ["CS111", "BK111", "BK112", "BK113"];
    const student = await Student.findById(req.params.id);
    const courses = student.specialty === "Frontend" ? FRONTEND : BACKEND;
    const joined = student.joinedCourses.map( c => c.courseCode);
    const notJoinedCourses = courses.filter( course => !joined.includes(course));
    // check if the student finished all his specialty courses
    if(notJoinedCourses.length === 0) {
        res.status(400);
        throw new Error("Student has finished all his specialty courses");
    }
    const lastCourse = await Course.findOne({code: student.joinedCourses[joined.length -1].courseCode});
    const nextCourse = await Course.findOne({code: notJoinedCourses[0]});
    // New student
    if(student.joinedCourses.length === 0) {
        const course = await Course.findOne({code: "CS111"});
        res.status(200).json(course);
        return
    }
    // Intersecting courses
    if((student.joinedCourses[joined.length -1].progress) !== 'attended'&& 
    (nextCourse.startDate).getTime() < (lastCourse.endDate).getTime() ) {
        res.status(400);
        throw new Error("Student is attending a course intersecting with the expected next course.");
    }
    // check for last course quiz
    if(student.joinedCourses[joined.length -1].quiz === null ) {
        res.status(200).json({
            message: "You need to pass last course exam",
            course: lastCourse
        })
        return
    }
    // Check if the user deserves
    if(student.joinedCourses[joined.length -1].quiz < 5 ) {
        res.status(200).json({
            message: "You need to re-check last course",
            course: lastCourse
        })
        return
    }
    // upcoming recommended course
    if(student.joinedCourses[joined.length -1].quiz >= 5 && student.joinedCourses[joined.length -1].progress === "attended") {
        res.status(200).json(nextCourse);
        return
    }
});

// Get course progress percentage function
const progressPerentage = (startDate, endDate) => {
    const start = startDate.getTime();
    const end = endDate.getTime();
    const now = new Date();
    const totalDays = (end - start) /1000 /60/60/24;
    const daysLeft = (end - now.getTime()) /1000 /60/60/24;
    const progress = parseInt(((totalDays - daysLeft) / totalDays) * 100);
    return (progress < 0 ? 0 : progress) ;
}


module.exports = { 
    getAllCourses,
    addCourse, 
    getCourse, 
    updataCourse, 
    deleteCourse,
    frequentlyVisited,
    recommended 
};