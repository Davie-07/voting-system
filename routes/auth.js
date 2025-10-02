const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { generateToken, hashPassword, comparePassword } = require('../utils/authUtils');

// @route   POST api/auth/student/register
// @desc    Register student
// @access  Public
router.post('/student/register', [
  check('firstName', 'First name is required').not().isEmpty(),
  check('admissionNumber', 'Admission number is required').not().isEmpty(),
  check('course', 'Course is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, admissionNumber, course, password } = req.body;

  try {
    // Check if student already exists
    let user = await User.findOne({ admissionNumber });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Student already exists with this admission number' }] });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    user = new User({
      firstName,
      admissionNumber,
      course,
      password: hashedPassword
    });

    await user.save();

    // Return jwt
    const payload = {
      user: {
        id: user.id,
        role: 'student'
      }
    };

    const token = generateToken(payload);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/student/login
// @desc    Login student
// @access  Public
router.post('/student/login', [
  check('admissionNumber', 'Admission number is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { admissionNumber, password } = req.body;

  try {
    // Check if student exists
    let user = await User.findOne({ admissionNumber });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Return jwt
    const payload = {
      user: {
        id: user.id,
        role: 'student'
      }
    };

    const token = generateToken(payload);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/admin/login
// @desc    Login admin
// @access  Public
router.post('/admin/login', [
  check('systemId', 'System ID is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { systemId, password } = req.body;

  try {
    // Check if admin exists
    let admin = await Admin.findOne({ systemId });
    if (!admin) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Compare password
    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Return jwt
    const payload = {
      user: {
        id: admin.id,
        role: 'admin'
      }
    };

    const token = generateToken(payload);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;