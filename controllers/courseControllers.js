const asyncHandler = require('express-async-handler');
const Course = require('../models/courseModel');

// @desc   Get all courses data
// @route  GET /api/courses/
// @access Public
const getAllCourses = asyncHandler(async (req, res) => {

});

// @desc   Add new course
// @route  POST /api/courses/
// @access Private (super admins and admins only)
const addCourse = asyncHandler(async (req, res) => {

});

// @desc   Get specific course data
// @route  GET /api/courses/:id
// @access Public
const getCourse = asyncHandler(async (req, res) => {

});

// @desc   Update course data
// @route  PATCH /api/courses/:id
// @access Private (super admins and admins only)
const updataCourse = asyncHandler(async (req, res) => {

});

// @desc   Delete course
// @route  DELETE /api/courses/:id
// @access Private (super admins and admins only)
const deleteCourse = asyncHandler(async (req, res) => {

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