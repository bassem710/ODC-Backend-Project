require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const colors = require('colors');
const bodyParser = require('body-parser');
// error handler
const connectDB = require('./config/db');
const port = process.env.PORT || 5000

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));

// Routes

// Error handler execution

app.listen(port, _ => console.log(`Server started on port: ${port}` .cyan))