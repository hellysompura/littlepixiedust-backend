// app.js
const express = require('express');
const mongoose = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// Auth this line
app.use('/api/auth', authRoutes);

// User Routes
app.use('/api/users', userRoutes);

module.exports = app;
