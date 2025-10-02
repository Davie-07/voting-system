const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Contestant = require('../models/Contestant');
const Vote = require('../models/Vote');
const VotingSession = require('../models/VotingSession');

// @route   POST api/voting/vote
// @desc    Cast vote
// @access  Private (Student)
router.post('/vote', auth, async (req, res) => {
  try {
    const { contestantId, position } = req.body;
    
    // Check if voting is open
    const session = await VotingSession.findOne();
    if (!session || !session.isOpen) {
      return res.status(400).json({ msg: 'Voting is not currently open' });
    }
    
    // Check if student has already voted for this position
    const existingVote = await Vote.findOne({ 
      student: req.user.id, 
      position: position 
    });
    
    if (existingVote) {
      return res.status(400).json({ msg: 'You have already voted for this position' });
    }
    
    // Verify contestant exists
    const contestant = await Contestant.findById(contestantId);
    if (!contestant) {
      return res.status(404).json({ msg: 'Contestant not found' });
    }
    
    // Verify position matches
    if (contestant.position !== position) {
      return res.status(400).json({ msg: 'Invalid position for this contestant' });
    }
    
    // Create vote
    const vote = new Vote({
      student: req.user.id,
      position,
      contestant: contestantId
    });
    
    await vote.save();
    
    // Increment contestant vote count
    await Contestant.findByIdAndUpdate(contestantId, {
      $inc: { votes: 1 }
    });
    
    res.json({ msg: 'Vote cast successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/voting/live-results
// @desc    Get live voting results
// @access  Private (Student)
router.get('/live-results', auth, async (req, res) => {
  try {
    // Get all contestants with vote counts
    const contestants = await Contestant.find().sort({ position: 1, votes: -1 });
    
    // Group results by position
    const resultsByPosition = {};
    
    // Initialize positions
    contestants.forEach(contestant => {
      if (!resultsByPosition[contestant.position]) {
        resultsByPosition[contestant.position] = [];
      }
      resultsByPosition[contestant.position].push(contestant);
    });
    
    // Get top candidate for each position
    const topCandidates = {};
    Object.keys(resultsByPosition).forEach(position => {
      if (resultsByPosition[position].length > 0) {
        topCandidates[position] = resultsByPosition[position][0];
      }
    });
    
    res.json({
      allContestants: contestants,
      byPosition: resultsByPosition,
      leaders: topCandidates
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;