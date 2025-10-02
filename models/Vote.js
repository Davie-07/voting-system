const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  position: {
    type: String,
    required: true
  },
  contestant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contestant',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vote', VoteSchema);