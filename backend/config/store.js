// ==============================================================================
// Stock Pulse — Resilient In-Memory Data Store (Fallback for Standalone Mode)
// ==============================================================================
// When MongoDB is running, Mongoose models are used.
// When MongoDB is NOT connected (e.g. running locally without MongoDB installed),
// this in-memory store allows registration, login, portfolio management, and
// watchlists to work seamlessly without crashing or throwing server errors.
// ==============================================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// In-memory data collections
const memoryUsers = [];
const memoryPortfolios = [];
const memoryWatchlists = [];

const isMongoConnected = () => mongoose.connection.readyState === 1;

// --- User Operations ---
const findUserByEmail = async (email) => {
  if (isMongoConnected()) {
    const User = require('../models/User');
    return await User.findOne({ email });
  }
  return memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

const findUserById = async (id) => {
  if (isMongoConnected()) {
    const User = require('../models/User');
    return await User.findById(id).select('-password');
  }
  const user = memoryUsers.find(u => u._id === id || u.id === id);
  if (!user) return null;
  const { password, ...userWithoutPass } = user;
  return userWithoutPass;
};

const createUser = async ({ name, email, password }) => {
  if (isMongoConnected()) {
    const User = require('../models/User');
    return await User.create({ name, email, password });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = {
    _id: `mem_user_${Date.now()}`,
    id: `mem_user_${Date.now()}`,
    name,
    email,
    password: hashedPassword,
    matchPassword: async function(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    }
  };
  memoryUsers.push(newUser);
  return newUser;
};

// --- Portfolio Operations ---
const findPortfolioByUser = async (userId) => {
  if (isMongoConnected()) {
    const Portfolio = require('../models/Portfolio');
    let p = await Portfolio.findOne({ user: userId });
    if (!p) {
      p = await Portfolio.create({ user: userId, stocks: [] });
    }
    return p;
  }
  let p = memoryPortfolios.find(item => item.user === userId);
  if (!p) {
    p = {
      _id: `mem_port_${Date.now()}`,
      user: userId,
      stocks: []
    };
    memoryPortfolios.push(p);
  }
  return p;
};

const addStockToPortfolio = async (userId, { symbol, name, quantity, buyPrice }) => {
  if (isMongoConnected()) {
    const Portfolio = require('../models/Portfolio');
    let portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      portfolio = new Portfolio({ user: userId, stocks: [] });
    }
    portfolio.stocks.push({ symbol: symbol.toUpperCase(), name, quantity, buyPrice });
    await portfolio.save();
    return portfolio;
  }
  const portfolio = await findPortfolioByUser(userId);
  portfolio.stocks.push({
    _id: `stock_${Date.now()}`,
    symbol: symbol.toUpperCase(),
    name,
    quantity: Number(quantity),
    buyPrice: Number(buyPrice),
    addedAt: new Date()
  });
  return portfolio;
};

const removeStockFromPortfolio = async (userId, stockId) => {
  if (isMongoConnected()) {
    const Portfolio = require('../models/Portfolio');
    const portfolio = await Portfolio.findOne({ user: userId });
    if (portfolio) {
      portfolio.stocks.pull(stockId);
      await portfolio.save();
    }
    return portfolio;
  }
  const portfolio = await findPortfolioByUser(userId);
  portfolio.stocks = portfolio.stocks.filter(s => s._id !== stockId && s.id !== stockId);
  return portfolio;
};

// --- Watchlist Operations ---
const findWatchlistByUser = async (userId) => {
  if (isMongoConnected()) {
    const Watchlist = require('../models/Watchlist');
    let w = await Watchlist.findOne({ user: userId });
    if (!w) {
      w = await Watchlist.create({ user: userId, stocks: [] });
    }
    return w;
  }
  let w = memoryWatchlists.find(item => item.user === userId);
  if (!w) {
    w = {
      _id: `mem_watch_${Date.now()}`,
      user: userId,
      stocks: []
    };
    memoryWatchlists.push(w);
  }
  return w;
};

const addStockToWatchlist = async (userId, { symbol, name }) => {
  if (isMongoConnected()) {
    const Watchlist = require('../models/Watchlist');
    let watchlist = await Watchlist.findOne({ user: userId });
    if (!watchlist) {
      watchlist = new Watchlist({ user: userId, stocks: [] });
    }
    if (!watchlist.stocks.some(s => s.symbol === symbol.toUpperCase())) {
      watchlist.stocks.push({ symbol: symbol.toUpperCase(), name });
      await watchlist.save();
    }
    return watchlist;
  }
  const watchlist = await findWatchlistByUser(userId);
  if (!watchlist.stocks.some(s => s.symbol === symbol.toUpperCase())) {
    watchlist.stocks.push({
      _id: `watch_${Date.now()}`,
      symbol: symbol.toUpperCase(),
      name,
      addedAt: new Date()
    });
  }
  return watchlist;
};

const removeStockFromWatchlist = async (userId, stockId) => {
  if (isMongoConnected()) {
    const Watchlist = require('../models/Watchlist');
    const watchlist = await Watchlist.findOne({ user: userId });
    if (watchlist) {
      watchlist.stocks.pull(stockId);
      await watchlist.save();
    }
    return watchlist;
  }
  const watchlist = await findWatchlistByUser(userId);
  watchlist.stocks = watchlist.stocks.filter(s => s._id !== stockId && s.id !== stockId && s.symbol !== stockId);
  return watchlist;
};

module.exports = {
  isMongoConnected,
  findUserByEmail,
  findUserById,
  createUser,
  findPortfolioByUser,
  addStockToPortfolio,
  removeStockFromPortfolio,
  findWatchlistByUser,
  addStockToWatchlist,
  removeStockFromWatchlist
};
