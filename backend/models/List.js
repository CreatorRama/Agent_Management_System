const mongoose = require('mongoose');

const ListItemSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
});

const ListSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  agentName: {
    type: String,
    required: true
  },
  items: [ListItemSchema],
  uploadDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('List', ListSchema);