const express = require('express');
const router = express.Router();
const { getAllCourses, addCourse, getCourse, updataCourse, deleteCourse, frequentlyVisited, recommended, moneyData } = require('../controllers/courseControllers');
const { protect } = require('../middlewares/authMiddleware');

// Courses APIs
router.route('/').get(getAllCourses).post(protect, addCourse);
router.route('/frequently-visited').get(frequentlyVisited);
router.route('/recommended/:id').get(recommended);
router.route('/money').get(protect, moneyData);
router.route('/:id').get(getCourse).patch(protect, updataCourse).delete(protect, deleteCourse);

module.exports = router;