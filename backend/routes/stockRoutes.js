const express = require('express');
const router = express.Router();
const { searchStocks, getStockDetails, getStockChart } = require('../controllers/stockController');

router.get('/search', searchStocks);
router.get('/:symbol', getStockDetails);
router.get('/:symbol/chart', getStockChart);

module.exports = router;
