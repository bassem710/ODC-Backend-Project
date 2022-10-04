const express = require('express');
const { get } = require('mongoose');
const router = express.Router();
const { myData, loginAdmin, addAdmin, getAdmin, adminsData, deleteAdmin, updateAdmin} = require('../controllers/adminControllers');
const { protect } = require('../middlewares/authMiddleware');
// APIs for all admins
router.get('/my-data',protect, myData);
router.post('/login', loginAdmin);

// APIs for super admins only
router.route('/').get(protect, adminsData).post(protect, addAdmin);
router.route('/:id').get(protect, getAdmin).patch(protect, updateAdmin).delete(protect, deleteAdmin);

module.exports = router;