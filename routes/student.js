const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Contestant = require('../models/Contestant');
const Vote = require('../models/Vote');
const VotingSession = require('../models/VotingSession');

// @route   GET api/student/contestants
// @desc    Get all published contestants
// @access  Private (Student)
router.get('/contestants', auth, async (req, res) => {
  try {
    const contestants = await Contestant.find().sort({ position: 1, name: 1 });
    
    // Group contestants by position
    const groupedContestants = {};
    contestants.forEach(contestant => {
      if (!groupedContestants[contestant.position]) {
        groupedContestants[contestant.position] = [];
      }
      groupedContestants[contestant.position].push(contestant);
    });
    
    res.json(groupedContestants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/student/voting/session
// @desc    Get voting session status
// @access  Private (Student)
router.get('/voting/session', auth, async (req, res) => {
  try {
    const session = await VotingSession.findOne();
    res.json(session || {});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/student/voting/positions
// @desc    Get positions with voting status
// @access  Private (Student)
router.get('/voting/positions', auth, async (req, res) => {
  try {
    const contestants = await Contestant.find();
    
    // Get positions
    const positions = [...new Set(contestants.map(c => c.position))];
    
    // Check which positions student has voted for
    const studentVotes = await Vote.find({ student: req.user.id });
    const votedPositions = [...new Set(studentVotes.map(v => v.position))];
    
    // Create position status
    const positionStatus = positions.map(position => ({
      position,
      hasVoted: votedPositions.includes(position)
    }));
    
    res.json(positionStatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;