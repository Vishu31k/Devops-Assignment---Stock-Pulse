const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  stocks: [
    {
      symbol: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      quantity: {
        type: Number,
        required: true,
      },
      buyPrice: {
        type: Number,
        required: true,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
