const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/admin');
const Contestant = require('../models/Contestant');
const VotingSession = require('../models/VotingSession');
const Vote = require('../models/Vote');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// @route   POST api/admin/contestants
// @desc    Add contestant
// @access  Private (Admin)
router.post('/contestants', auth, upload.single('photo'), [
  check('name', 'Name is required').not().isEmpty(),
  check('course', 'Course is required').not().isEmpty(),
  check('position', 'Position is required').not().isEmpty(),
  check('manifesto', 'Manifesto is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, course, position, manifesto } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : '';

    const contestant = new Contestant({
      name,
      course,
      position,
      manifesto,
      photo
    });

    await contestant.save();
    res.json(contestant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/admin/contestants
// @desc    Get all contestants
// @access  Private (Admin)
router.get('/contestants', auth, async (req, res) => {
  try {
    const contestants = await Contestant.find().sort({ date: -1 });
    res.json(contestants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/admin/contestants/:id
// @desc    Update contestant
// @access  Private (Admin)
router.put('/contestants/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const { name, course, position, manifesto } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : undefined;

    const contestantFields = {};
    if (name) contestantFields.name = name;
    if (course) contestantFields.course = course;
    if (position) contestantFields.position = position;
    if (manifesto) contestantFields.manifesto = manifesto;
    if (photo) contestantFields.photo = photo;

    let contestant = await Contestant.findById(req.params.id);
    if (!contestant) {
      return res.status(404).json({ msg: 'Contestant not found' });
    }

    contestant = await Contestant.findByIdAndUpdate(
      req.params.id,
      { $set: contestantFields },
      { new: true }
    );

    res.json(contestant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/admin/contestants/:id
// @desc    Delete contestant
// @access  Private (Admin)
router.delete('/contestants/:id', auth, async (req, res) => {
  try {
    const contestant = await Contestant.findById(req.params.id);
    if (!contestant) {
      return res.status(404).json({ msg: 'Contestant not found' });
    }

    await contestant.remove();
    res.json({ msg: 'Contestant removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/admin/voting/open
// @desc    Open voting session
// @access  Private (Admin)
router.post('/voting/open', auth, async (req, res) => {
  try {
    let session = await VotingSession.findOne();
    if (!session) {
      session = new VotingSession();
    }
    
    session.isOpen = true;
    session.startDate = Date.now();
    
    await session.save();
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/admin/voting/close
// @desc    Close voting session
// @access  Private (Admin)
router.post('/voting/close', auth, async (req, res) => {
  try {
    let session = await VotingSession.findOne();
    if (!session) {
      session = new VotingSession();
    }
    
    session.isOpen = false;
    session.endDate = Date.now();
    
    await session.save();
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/admin/voting/schedule
// @desc    Schedule voting session
// @access  Private (Admin)
router.post('/voting/schedule', auth, [
  check('startDate', 'Start date is required').not().isEmpty(),
  check('endDate', 'End date is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { startDate, endDate } = req.body;
    
    let session = await VotingSession.findOne();
    if (!session) {
      session = new VotingSession();
    }
    
    session.startDate = startDate;
    session.endDate = endDate;
    
    await session.save();
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/admin/voting/session
// @desc    Get voting session
// @access  Private (Admin)
router.get('/voting/session', auth, async (req, res) => {
  try {
    const session = await VotingSession.findOne();
    res.json(session || {});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/admin/voting/results
// @desc    Get voting results
// @access  Private (Admin)
router.get('/voting/results', auth, async (req, res) => {
  try {
    // Get all votes
    const votes = await Vote.find().populate('student', ['firstName', 'admissionNumber']).populate('contestant', ['name']);
    
    // Get all contestants with vote counts
    const contestants = await Contestant.find();
    
    // Group results by position
    const resultsByPosition = {};
    
    // Initialize positions
    contestants.forEach(contestant => {
      if (!resultsByPosition[contestant.position]) {
        resultsByPosition[contestant.position] = [];
      }
    });
    
    // Add contestant data with vote counts
    for (const contestant of contestants) {
      const voteCount = await Vote.countDocuments({ contestant: contestant._id });
      resultsByPosition[contestant.position].push({
        contestant: contestant,
        votes: voteCount
      });
    }
    
    // Sort contestants within each position by vote count
    Object.keys(resultsByPosition).forEach(position => {
      resultsByPosition[position].sort((a, b) => b.votes - a.votes);
    });
    
    res.json({
      overall: contestants.sort((a, b) => b.votes - a.votes),
      byPosition: resultsByPosition,
      totalVotes: votes.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;