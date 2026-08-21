const store = require('../config/store');

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await store.findWatchlistByUser(req.user._id);
    res.json(watchlist);
  } catch (error) {
    console.error('getWatchlist error:', error.message);
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
      return res.status(400).json({ message: 'Please provide a stock symbol' });
    }

    const watchlist = await store.addStockToWatchlist(req.user._id, { symbol, name });
    res.status(201).json(watchlist);
  } catch (error) {
    console.error('addToWatchlist error:', error.message);
    res.status(500).json({ message: 'Server error adding to watchlist' });
  }
};

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlist/remove/:stockId
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const { stockId } = req.params;
    const watchlist = await store.removeStockFromWatchlist(req.user._id, stockId);
    res.json(watchlist);
  } catch (error) {
    console.error('removeFromWatchlist error:', error.message);
    res.status(500).json({ message: 'Server error removing from watchlist' });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
};
