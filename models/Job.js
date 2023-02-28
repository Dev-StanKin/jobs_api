const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'please provide company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'please provide a position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enums: ['Interview', 'Pending', 'Declined'],
      default: 'Pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('jobs', JobSchema);
