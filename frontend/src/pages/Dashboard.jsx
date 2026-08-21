import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import StockCard from '../components/StockCard';
import { useAuth } from '../context/AuthContext';
import { getPortfolioSummary, getWatchlist } from '../services/api';

// Mock data for market overview since we might not have a reliable real-time batch API
const DEFAULT_MARKET_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 1.25, changePercent: 0.70 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 335.02, change: -2.15, changePercent: -0.64 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.58, change: 0.85, changePercent: 0.62 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 131.69, change: 2.10, changePercent: 1.62 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 238.82, change: -5.40, changePercent: -2.21 }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Try fetching actual data, fallback to empty arrays if backend not ready
        const [portData, watchData] = await Promise.all([
          getPortfolioSummary().catch(() => null),
          getWatchlist().catch(() => ({ stocks: [] }))
        ]);
        
        if (portData) setPortfolioSummary(portData);
        // Backend returns { stocks: [...] } — extract the array
        const watchStocks = watchData?.stocks || watchData || [];
        setWatchlist(watchStocks);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard page-container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name || 'Investor'}!</h1>
          <p className="page-subtitle">Here's your market summary for today.</p>
        </div>
        <div className="search-section">
          <SearchBar />
        </div>
      </div>

      <div className="dashboard-content">
        <section className="dashboard-section">
          <h2 className="section-title">Market Overview</h2>
          <div className="stock-grid">
            {DEFAULT_MARKET_STOCKS.map(stock => (
              <StockCard key={stock.symbol} {...stock} />
            ))}
          </div>
        </section>

        <div className="dashboard-columns">
          <section className="dashboard-section split-col">
            <h2 className="section-title">Portfolio Quick View</h2>
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : portfolioSummary && portfolioSummary.stocks?.length > 0 ? (
              <div className="quick-view-list">
                {portfolioSummary.stocks.slice(0, 3).map(stock => (
                  <div key={stock.symbol} className="quick-view-item">
                    <div className="qv-left">
                      <span className="qv-symbol">{stock.symbol}</span>
                      <span className="qv-qty">{stock.quantity} shares</span>
                    </div>
                    <div className="qv-right">
                      <span className="qv-price">${parseFloat(stock.currentPrice || stock.buyPrice).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state small">
                <p>No stocks in your portfolio yet.</p>
              </div>
            )}
          </section>

          <section className="dashboard-section split-col">
            <h2 className="section-title">Watchlist</h2>
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : watchlist.length > 0 ? (
              <div className="quick-view-list">
                {watchlist.slice(0, 3).map(stock => (
                  <div key={stock.symbol} className="quick-view-item">
                    <div className="qv-left">
                      <span className="qv-symbol">{stock.symbol}</span>
                    </div>
                    <div className="qv-right">
                      <span className="qv-price">${parseFloat(stock.price || 0).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state small">
                <p>Your watchlist is empty.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
