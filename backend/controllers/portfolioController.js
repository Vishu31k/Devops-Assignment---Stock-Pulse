const store = require('../config/store');
const axios = require('axios');

// Helper to get mock price for development/testing
const getMockPrice = () => 150.25;

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await store.findPortfolioByUser(req.user._id);
    res.json(portfolio);
  } catch (error) {
    console.error('getPortfolio error:', error.message);
    res.status(500).json({ message: 'Server error fetching portfolio' });
  }
};

// @desc    Add stock to portfolio
// @route   POST /api/portfolio/add
// @access  Private
const addStock = async (req, res) => {
  try {
    const { symbol, name, quantity, buyPrice } = req.body;

    if (!symbol || !quantity || !buyPrice) {
      return res.status(400).json({ message: 'Please provide symbol, quantity, and buyPrice' });
    }

    const portfolio = await store.addStockToPortfolio(req.user._id, {
      symbol,
      name,
      quantity,
      buyPrice
    });

    res.status(201).json(portfolio);
  } catch (error) {
    console.error('addStock error:', error.message);
    res.status(500).json({ message: 'Server error adding stock' });
  }
};

// @desc    Remove stock from portfolio
// @route   DELETE /api/portfolio/remove/:stockId
// @access  Private
const removeStock = async (req, res) => {
  try {
    const { stockId } = req.params;
    const portfolio = await store.removeStockFromPortfolio(req.user._id, stockId);
    res.json(portfolio);
  } catch (error) {
    console.error('removeStock error:', error.message);
    res.status(500).json({ message: 'Server error removing stock' });
  }
};

// @desc    Get portfolio summary with current prices
// @route   GET /api/portfolio/summary
// @access  Private
const getPortfolioSummary = async (req, res) => {
  try {
    const portfolio = await store.findPortfolioByUser(req.user._id);

    if (!portfolio || !portfolio.stocks || portfolio.stocks.length === 0) {
      return res.json({
        stocks: [],
        totalInvested: 0,
        totalCurrentValue: 0,
        totalProfitLoss: 0,
        totalProfitLossPercent: 0
      });
    }

    let totalInvested = 0;
    let totalCurrentValue = 0;
    const stocksSummary = [];

    // Process each stock
    for (let stock of portfolio.stocks) {
      let currentPrice = getMockPrice(); // Default mock

      // If API key exists, try to get real price
      if (process.env.ALPHA_VANTAGE_API_KEY && process.env.ALPHA_VANTAGE_API_KEY !== 'demo') {
        try {
          const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);
          const quote = response.data['Global Quote'];
          if (quote && quote['05. price']) {
            currentPrice = parseFloat(quote['05. price']);
          }
        } catch (err) {
          console.error(`Error fetching price for ${stock.symbol}:`, err.message);
        }
      }

      const invested = Number(stock.quantity) * Number(stock.buyPrice);
      const currentValue = Number(stock.quantity) * currentPrice;
      const profitLoss = currentValue - invested;
      const profitLossPercent = invested > 0 ? (profitLoss / invested) * 100 : 0;

      totalInvested += invested;
      totalCurrentValue += currentValue;

      stocksSummary.push({
        _id: stock._id || stock.id,
        symbol: stock.symbol,
        name: stock.name || stock.symbol,
        quantity: stock.quantity,
        buyPrice: stock.buyPrice,
        currentPrice,
        totalInvested: invested,
        currentValue,
        profitLoss,
        profitLossPercent
      });
    }

    const totalProfitLoss = totalCurrentValue - totalInvested;
    const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    res.json({
      stocks: stocksSummary,
      totalInvested,
      totalCurrentValue,
      totalProfitLoss,
      totalProfitLossPercent
    });
  } catch (error) {
    console.error('getPortfolioSummary error:', error.message);
    res.status(500).json({ message: 'Server error fetching portfolio summary' });
  }
};

module.exports = {
  getPortfolio,
  addStock,
  removeStock,
  getPortfolioSummary
};
