import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: '/api',
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Stock APIs
export const searchStocks = async (query) => {
  const response = await api.get(`/stocks/search?q=${query}`);
  return response.data;
};

export const getStockDetails = async (symbol) => {
  const response = await api.get(`/stocks/${symbol}`);
  return response.data;
};

export const getStockChart = async (symbol, interval = 'daily') => {
  const response = await api.get(`/stocks/${symbol}/chart?interval=${interval}`);
  return response.data;
};

// Portfolio APIs
export const getPortfolio = async () => {
  const response = await api.get('/portfolio');
  return response.data;
};

export const getPortfolioSummary = async () => {
  const response = await api.get('/portfolio/summary');
  return response.data;
};

export const addStockToPortfolio = async (stockData) => {
  const response = await api.post('/portfolio/add', stockData);
  return response.data;
};

export const removeStockFromPortfolio = async (stockId) => {
  const response = await api.delete(`/portfolio/remove/${stockId}`);
  return response.data;
};

// Watchlist APIs
export const getWatchlist = async () => {
  const response = await api.get('/watchlist');
  return response.data;
};

export const addToWatchlist = async (stockData) => {
  const response = await api.post('/watchlist/add', stockData);
  return response.data;
};

export const removeFromWatchlist = async (stockId) => {
  const response = await api.delete(`/watchlist/remove/${stockId}`);
  return response.data;
};

export default api;
