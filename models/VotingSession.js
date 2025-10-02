const mongoose = require('mongoose');

const VotingSessionSchema = new mongoose.Schema({
  isOpen: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VotingSession', VotingSessionSchema);