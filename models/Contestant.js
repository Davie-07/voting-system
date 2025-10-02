const mongoose = require('mongoose');

const ContestantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  manifesto: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  votes: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contestant', ContestantSchema);