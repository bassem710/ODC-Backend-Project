const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel');
const { generateToken } = require('../middlewares/authMiddleware');

// @desc   Get admin data
// @route  GET /api/admins/my-data
// @access Private (all)
const myData = asyncHandler(async (req, res) => {
    res.status(200).json(req.admin);
});

// @desc   Login admin
// @route  POST /api/admins/login
// @access public (all)
const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    // Check for admin username
    const admin = await Admin.findOne({username});
    // check if is not disabled
    if(admin.disabled) {
        res.status(400);
        throw new Error("Admin is disabled by ODC super admins");
    }
    if(admin && (await bcrypt.compare(password, admin.password))){
        res.status(201).json({
            _id: admin.id,
            authority: admin.authority,
            firstName: admin.firstName,
            lastName: admin.lastName,
            username: admin.username,
            token: generateToken(admin._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @desc   Get admin data
// @route  GET /api/admins/:id
// @access Private (Super admins and owner only)
const getAdmin = asyncHandler(async (req, res) => {
    if(req.admin.authority !== "super admin" && req.admin.authority !== "owner") {
        res.status(400);
        throw new Error('Not authorized to view admins data');
    }
    const data = await Admin.findById(req.params.id);
    // check for admin data
    if(!data) {
        res.status(400);
        throw new Error("Invalid admin data");
    }
    res.status(200).json(data);
});

// @desc   Get admins data
// @route  GET /api/admins
// @access Private (Super admins and owner only)
const adminsData = asyncHandler(async (req, res) => {
    if(req.admin.authority !== "super admin" && req.admin.authority !== "owner") {
        res.status(400);
        throw new Error('Not authorized to view admins data');
    }
    // DB query returns all admins data (not including the logged in admin )
    const data = await Admin.find({ _id: { $ne : req.admin.id }}).select('-password');
    // check for admins data
    if(!data) {
        res.status(400);
        throw new Error("Invalid admins data");
    }
    res.status(200).json(data);
});

// @desc   add new admin
// @route  POST /api/admins
// @access Private (Super admins and owner only)
const addAdmin = asyncHandler(async (req, res) => {
    const { authority, firstName, lastName, username, password } = req.body;
    if(!authority || !firstName || !lastName || !username || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }
    // check for admin's role
    if(req.admin.authority !== 'super admin' && req.admin.authority !== 'owner') {
        res.status(400);
        throw new Error('Not authorized to add new admin');
    }
    // check if admin exists
    const adminExists = await Admin.findOne({username});
    if(adminExists) {
        res.status(400);
        throw new Error("Admin already exists");
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create admin 
    const admin = await Admin.create({
        disabled: false,
        authority,
        firstName,
        lastName,
        username,
        password: hashedPassword
    });
    if(admin){
        res.status(201).json({
            _id: admin.id,
            disabled: false,
            authority: admin.authority,
            firstName: admin.firstName,
            lastName: admin.lastName,
            username: admin.username,
            token: generateToken(admin._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid admin data');
    }
});

// @desc   Updata an admin data
// @route  PATCH /api/admins/:id
// @access Private (Super admins and owner only)
const updateAdmin = asyncHandler(async (req, res) => {
    // check for admin's role
    if(req.admin.authority !== 'super admin' && req.admin.authority !== 'owner' && req.admin.id !== req.params.id) {
        res.status(400);
        throw new Error('Not authorized to update admin data');
    }
    const admin = await Admin.findById(req.params.id);
    // check for admin data
    if(!admin){
        res.status(400);
        throw new Error('Admin not found');
    }
    // check for both levels
    if(req.admin.authority !== "owner" && admin.authority === "super admin"){
        res.status(400);
        throw new Error("Not authorized to update super admin acoount")
    }
    // check for updated data
    if((req.admin.id === req.params.id) && req.body.authority){
        res.status(400);
        throw new Error("Not authorized to change admin's role");
    }
    await Admin.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(await Admin.findById(req.params.id));
});

// @desc   Delete an admin
// @route  DELETE /api/admins/:id
// @access Private (Super admins and owner only)
const deleteAdmin = asyncHandler(async (req, res) => {
    // check for admin's role
    if(req.admin.authority !== 'super admin' && req.admin.authority !== 'owner') {
        res.status(400);
        throw new Error('Not authorized to delete admin account');
    }
    const { id } = req.params;
    const admin = await Admin.findById(id);
    // check for authority level
    if(admin.authority === "owner"){
        res.status(400);
        throw new Error("Not authorized to delete owner account");
    }
    // check for both levels
    if(req.admin.authority !== "owner" && admin.authority === "super admin"){
        res.status(400);
        throw new Error("Not authorized to delete super admin acoount")
    }
    // check if the admin is already disabled
    if(admin.disabled === true){
        res.status(400);
        throw new Error("Already disabled");
    }
    // check for admin
    if(!admin) {
        res.status(400);
        throw new Error("Admin doesn't exists");
    }
    const disabled = await admin.update({disabled: true});
    if(!disabled){
        res.status(400);
        throw new Error("Couldn't disable the admin");
    }
    res.status(200).json({message: "Admin disabled", id: id})
});

module.exports = { 
    myData, 
    loginAdmin, 
    addAdmin, 
    getAdmin,
    adminsData, 
    deleteAdmin, 
    updateAdmin
};