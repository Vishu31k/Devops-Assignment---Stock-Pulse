const Watchlist = require('../models/Watchlist');

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user._id });

    if (!watchlist) {
      watchlist = await Watchlist.create({
        user: req.user._id,
        stocks: []
      });
    }

    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching watchlist' });
  }
};

// @desc    Add stock to watchlist
// @route   POST /api/watchlist/add
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const { symbol, name } = req.body;

    if (!symbol) {
      return res.status(400).json({ message: 'Please provide symbol' });
    }

    let watchlist = await Watchlist.findOne({ user: req.user._id });

    if (!watchlist) {
      watchlist = new Watchlist({
        user: req.user._id,
        stocks: []
      });
    }

    // Check if symbol already exists
    const exists = watchlist.stocks.find(s => s.symbol === symbol.toUpperCase());
    
    if (exists) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }

    // Add stock
    watchlist.stocks.push({
      symbol: symbol.toUpperCase(),
      name
    });

    await watchlist.save();

    res.status(201).json(watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding to watchlist' });
  }
};

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlist/remove/:stockId
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const { stockId } = req.params;

    const watchlist = await Watchlist.findOne({ user: req.user._id });

    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }

    watchlist.stocks.pull(stockId);
    
    await watchlist.save();

    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error removing from watchlist' });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
};
