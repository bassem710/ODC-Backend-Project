const express = require('express');
const router = express.Router();
const { getStudents, getOneStudent, addStudent } = require('../controllers/studentControllers');
const { protect } = require('../middlewares/authMiddleware');

// APIs
router.route("/").get(protect, getStudents).post(addStudent);
router.route("/:id").get(protect, getOneStudent);

module.exports = router;