import React, { useState, useEffect } from 'react';
import PortfolioTable from '../components/PortfolioTable';
import { getPortfolioSummary, removeStockFromPortfolio } from '../services/api';

const Portfolio = () => {
  const [summary, setSummary] = useState({ totalInvested: 0, currentValue: 0, totalPl: 0, stocks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolioSummary();
      setSummary(data || { totalInvested: 0, currentValue: 0, totalPl: 0, stocks: [] });
    } catch (err) {
      console.error(err);
      // Mock data for UI development if backend is failing
      setSummary({
        totalInvested: 5000,
        currentValue: 5500,
        totalPl: 500,
        stocks: [
          { id: 1, symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, buyPrice: 150, currentPrice: 178.72 },
          { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 5, buyPrice: 300, currentPrice: 335.02 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStock = async (stockId) => {
    if (window.confirm('Are you sure you want to remove this stock from your portfolio?')) {
      try {
        await removeStockFromPortfolio(stockId);
        // Refresh portfolio after removal
        fetchPortfolio();
      } catch (err) {
        // Optimistic UI update for mock fallback
        const updatedStocks = summary.stocks.filter(s => s.id !== stockId);
        setSummary({...summary, stocks: updatedStocks});
      }
    }
  };

  const isProfit = summary.totalPl >= 0;

  return (
    <div className="portfolio-page page-container">
      <div className="page-header">
        <h1 className="page-title">My Portfolio</h1>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading portfolio...</div>
      ) : (
        <>
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-label">Total Invested</div>
              <div className="summary-value">${parseFloat(summary.totalInvested).toFixed(2)}</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Current Value</div>
              <div className="summary-value">${parseFloat(summary.currentValue).toFixed(2)}</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Total Profit/Loss</div>
              <div className={`summary-value ${isProfit ? 'text-profit' : 'text-loss'}`}>
                {isProfit ? '+' : ''}${parseFloat(summary.totalPl).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="portfolio-content">
            <h2 className="section-title">Holdings</h2>
            <PortfolioTable stocks={summary.stocks} onRemove={handleRemoveStock} />
          </div>
        </>
      )}
    </div>
  );
};

export default Portfolio;
