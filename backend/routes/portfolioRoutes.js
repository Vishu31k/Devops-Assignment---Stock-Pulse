const express = require('express');
const router = express.Router();
const { getPortfolio, addStock, removeStock, getPortfolioSummary } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

router.get('/', getPortfolio);
router.post('/add', addStock);
router.delete('/remove/:stockId', removeStock);
router.get('/summary', getPortfolioSummary);

module.exports = router;
