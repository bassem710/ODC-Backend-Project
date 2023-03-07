require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Parse = require('parse/node');
const mongoose = require("mongoose");
const path = require("path");
const colors = require("colors");
const bodyParser = require("body-parser");
const { errorHandler } = require("./middlewares/errorHandler");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
mongoose.set('strictQuery', true);

Parse.serverURL = process.env.SERVER_URL;
Parse.initialize(
    process.env.APP_ID,
    process.env.JS_KEY,
    process.env.MASTER_KEY
);

// Routes
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));

// Error Handler Middleware
app.use(errorHandler);

// Server Listener
app.listen(port, (_) => console.log(`Server started on port: ${port}`.cyan));
