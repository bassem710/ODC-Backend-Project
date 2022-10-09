const asyncHandler = require("express-async-handler");
const Student = require("../models/studentModel");
const bcrypt = require("bcryptjs");
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
        throw new Error("Not authorized to view students data");
    }
    if (req.body.course) {
        const students = await Student.find({
            joinedCourses: { $elemMatch: { courseCode: req.body.course } },
        }).select("-password");
        if (!students) {
            res.status(400);
            throw new Error("Invalid students data");
        }
        res.status(200).json(students);
        return;
    }
    const students = await Student.find({}).select("-password");
    if (!students) {
        res.status(400);
        throw new Error("Invalid students data");
    }
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
        throw new Error("Not authorized to view student data");
    }
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
        res.status(400);
        throw new Error("Invalid students data");
    }
    res.status(200).json(student);
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
        res.status(400);
        throw new Error("Student already exist");
    }
    // skills
    const skills = [];
    // joined courses loop
    for (let i = 0; i < joinedCourses.length; i++) {
        const current = await Course.findOne({
            code: joinedCourses[i].courseCode,
        });
        if (joinedCourses[i].progress === "attended") {
            skills.push(...current.skills);
        }
        const updatedCourse = await Course.findOneAndUpdate(
            { code: joinedCourses[i].courseCode },
            {
                $push: {
                    enrolledStudents: {
                        email: email,
                        progress: joinedCourses[i].progress,
                    },
                },
            }
        );
        if (!updatedCourse) {
            res.status(400);
            throw new Error("Couldn't update course data (enrolled students)");
        }
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

// @desc   Get top students in specific specialty
// @route  GET /api/students/top
// @access Private
const topStudents = asyncHandler(async (req, res) => {
    // check for admin's role
    if (
        req.admin.authority !== "owner" &&
        req.admin.authority !== "super admin" &&
        req.admin.authority !== "admin" &&
        req.admin.authority !== "viewer"
    ) {
        res.status(400);
        throw new Error("Not authorized to view students data");
    }
    // check for top number
    if (req.body.top <= 0 || req.body.top > 10) {
        res.status(400);
        throw new Erro("Enter number from 1 to 10 in top field");
    }
    // check for req.body.specialty
    if (!req.body.specialty) {
        res.status(400);
        throw new Error("Please send specialty type");
    }
    // get students
    const specStudents = await Student.find(
        { specialty: req.body.specialty },
        "-password"
    )
        .sort([["joinedCourses", -1]])
        .limit(50);
    // check for returned data
    if (!specStudents) {
        res.status(400);
        throw new Error("Invalid students data");
    }
    let coursesFilter = specStudents;
    // first check (courses, quizes and courses)
    if (req.body.courses) {
        coursesFilter = [];
        let reqCourses = req.body.courses;
        specStudents.forEach((std) => {
            const jc = std.joinedCourses.map((c) =>
                c.quiz > 70 && c.project > 70 ? c.courseCode : null
            );
            let remainingCourses = reqCourses.filter((c) => !jc.includes(c));
            if (remainingCourses.length === 0) {
                coursesFilter.push(std);
            }
        });
    }
    // second check (skills)
    let skillsFilter = coursesFilter;
    if (req.body.skills) {
        let reqSkills = req.body.skills;
        skillsFilter = skillsFilter.filter((std) => {
            const skills = std.skills;
            const remainingSkills = reqSkills.filter(
                (s) => !skills.includes(s)
            );
            return remainingSkills.length === 0 ? true : false;
        });
    }
    // control number of returned students
    const num = req.body.top || 10;
    const top = skillsFilter.filter((std, index) =>
        index < num ? true : false
    );
    res.status(200).json(top);
});

module.exports = { getStudents, getOneStudent, addStudent, topStudents };
