const axios = require('axios');

// @desc    Search for stocks
// @route   GET /api/stocks/search
// @access  Public
const searchStocks = async (req, res) => {
  try {
    const { q } = req.query;
    
    // If no API key, return mock data
    if (!process.env.ALPHA_VANTAGE_API_KEY || process.env.ALPHA_VANTAGE_API_KEY === 'demo') {
      const mockData = [
        { symbol: 'AAPL', name: 'Apple Inc', type: 'Equity', region: 'United States' },
        { symbol: 'GOOGL', name: 'Alphabet Inc', type: 'Equity', region: 'United States' },
        { symbol: 'MSFT', name: 'Microsoft Corp', type: 'Equity', region: 'United States' },
        { symbol: 'AMZN', name: 'Amazon.com Inc', type: 'Equity', region: 'United States' },
        { symbol: 'TSLA', name: 'Tesla Inc', type: 'Equity', region: 'United States' }
      ];
      // Filter mock data by query if provided
      const filtered = q ? mockData.filter(stock => stock.symbol.toLowerCase().includes(q.toLowerCase()) || stock.name.toLowerCase().includes(q.toLowerCase())) : mockData;
      return res.json(filtered);
    }

    // Call Alpha Vantage API
    const response = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${q}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);
    
    // Format response
    const matches = response.data.bestMatches || [];
    const formattedData = matches.map(match => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region']
    }));

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stocks' });
  }
};

// @desc    Get stock details
// @route   GET /api/stocks/:symbol
// @access  Public
const getStockDetails = async (req, res) => {
  try {
    const { symbol } = req.params;

    // If no API key, return mock data
    if (!process.env.ALPHA_VANTAGE_API_KEY || process.env.ALPHA_VANTAGE_API_KEY === 'demo') {
      return res.json({
        symbol: symbol.toUpperCase(),
        price: 150.25,
        change: 2.50,
        changePercent: '1.69%',
        volume: 45678900,
        latestDay: new Date().toISOString().split('T')[0]
      });
    }

    // Call Alpha Vantage API
    const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);
    
    const quote = response.data['Global Quote'];
    
    if (!quote || Object.keys(quote).length === 0) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.json({
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'],
      volume: parseInt(quote['06. volume']),
      latestDay: quote['07. latest trading day']
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stock details' });
  }
};

// @desc    Get stock chart data
// @route   GET /api/stocks/:symbol/chart
// @access  Public
const getStockChart = async (req, res) => {
  try {
    const { symbol } = req.params;
    // const { interval } = req.query; // e.g. daily, weekly, monthly

    // If no API key, return mock data
    if (!process.env.ALPHA_VANTAGE_API_KEY || process.env.ALPHA_VANTAGE_API_KEY === 'demo') {
      const mockChart = [];
      let currentPrice = 140.0;
      let date = new Date();
      
      for (let i = 30; i >= 0; i--) {
        const entryDate = new Date(date);
        entryDate.setDate(date.getDate() - i);
        
        // Random walk
        const change = (Math.random() - 0.5) * 6; // +/- 3
        currentPrice += change;
        
        mockChart.push({
          date: entryDate.toISOString().split('T')[0],
          open: currentPrice - 1,
          high: currentPrice + 2,
          low: currentPrice - 2,
          close: currentPrice,
          volume: Math.floor(Math.random() * 50000000)
        });
      }
      
      return res.json(mockChart);
    }

    // Call Alpha Vantage API for TIME_SERIES_DAILY
    const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);
    
    const timeSeries = response.data['Time Series (Daily)'];
    
    if (!timeSeries) {
      return res.status(404).json({ message: 'Chart data not found' });
    }

    // Format top 30 days
    const dates = Object.keys(timeSeries).slice(0, 30);
    const chartData = dates.map(date => {
      const data = timeSeries[date];
      return {
        date,
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume'])
      };
    });

    res.json(chartData.reverse()); // Chronological order
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stock chart' });
  }
};

module.exports = {
  searchStocks,
  getStockDetails,
  getStockChart
};
