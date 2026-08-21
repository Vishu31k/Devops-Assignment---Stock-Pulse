const express = require('express');
const router = express.Router();
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

router.get('/', getWatchlist);
router.post('/add', addToWatchlist);
router.delete('/remove/:stockId', removeFromWatchlist);

module.exports = router;
