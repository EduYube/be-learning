const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  rating: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, // hide from output responses
  },
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;