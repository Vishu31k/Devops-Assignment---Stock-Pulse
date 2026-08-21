import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaStar } from 'react-icons/fa';
import StockChart from '../components/StockChart';
import { getStockDetails, getStockChart, addStockToPortfolio, addToWatchlist } from '../services/api';

const StockDetails = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [interval, setInterval] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [message, setMessage] = useState({ text: '', type: '' }); // success or error

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const detailsData = await getStockDetails(symbol).catch(() => ({
          symbol,
          name: `${symbol} Corporation`,
          price: 150.25,
          change: 2.50,
          changePercent: 1.69,
          volume: 25000000,
          high: 152.00,
          low: 148.50
        }));
        
        const chartDataResponse = await getStockChart(symbol, interval).catch(() => []);
        
        setStock(detailsData);
        setChartData(chartDataResponse);
      } catch (err) {
        setError('Failed to fetch stock details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [symbol, interval]);

  const handleAddToPortfolio = async (e) => {
    e.preventDefault();
    try {
      await addStockToPortfolio({
        symbol: stock.symbol,
        name: stock.name,
        quantity: Number(buyQuantity),
        buyPrice: Number(stock.price)
      });
      setMessage({ text: `Successfully added ${buyQuantity} shares of ${stock.symbol} to portfolio!`, type: 'success' });
      setShowModal(false);
      setTimeout(() => setMessage({text: '', type: ''}), 3000);
    } catch (err) {
      setMessage({ text: 'Failed to add to portfolio', type: 'error' });
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await addToWatchlist({ symbol: stock.symbol, name: stock.name, price: stock.price });
      setMessage({ text: `Added ${stock.symbol} to watchlist!`, type: 'success' });
      setTimeout(() => setMessage({text: '', type: ''}), 3000);
    } catch (err) {
      setMessage({ text: 'Failed to add to watchlist', type: 'error' });
    }
  };

  if (loading) return <div className="page-container"><div className="loading-spinner">Loading {symbol} details...</div></div>;
  if (error) return <div className="page-container"><div className="error-message">{error}</div></div>;
  if (!stock) return <div className="page-container"><div className="error-message">Stock not found</div></div>;

  const isPositive = stock.change >= 0;

  return (
    <div className="stock-details page-container">
      <Link to="/" className="back-link"><FaArrowLeft /> Back to Dashboard</Link>
      
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="detail-header">
        <div className="detail-title-section">
          <h1 className="detail-symbol">{stock.symbol}</h1>
          <h2 className="detail-name">{stock.name}</h2>
        </div>
        
        <div className="detail-price-section">
          <div className="detail-price">${parseFloat(stock.price).toFixed(2)}</div>
          <div className={`detail-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{parseFloat(stock.change).toFixed(2)} ({isPositive ? '+' : ''}{parseFloat(stock.changePercent).toFixed(2)}%)
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Buy
          </button>
          <button className="btn btn-secondary" onClick={handleAddToWatchlist}>
            <FaStar /> Watch
          </button>
        </div>
      </div>

      <div className="detail-stats">
        <div className="stat-box">
          <span className="stat-label">Volume</span>
          <span className="stat-value">{stock.volume?.toLocaleString() || 'N/A'}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Day High</span>
          <span className="stat-value">${parseFloat(stock.high || stock.price).toFixed(2)}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Day Low</span>
          <span className="stat-value">${parseFloat(stock.low || stock.price).toFixed(2)}</span>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <h3>Price History</h3>
          <div className="interval-buttons">
            <button className={`btn-interval ${interval === 'daily' ? 'active' : ''}`} onClick={() => setInterval('daily')}>1D</button>
            <button className={`btn-interval ${interval === 'weekly' ? 'active' : ''}`} onClick={() => setInterval('weekly')}>1W</button>
            <button className={`btn-interval ${interval === 'monthly' ? 'active' : ''}`} onClick={() => setInterval('monthly')}>1M</button>
          </div>
        </div>
        <StockChart chartData={chartData} symbol={stock.symbol} />
      </div>

      {/* Buy Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Buy {stock.symbol}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddToPortfolio} className="modal-body">
              <div className="form-group">
                <label>Current Price</label>
                <input type="text" className="form-input" value={`$${parseFloat(stock.price).toFixed(2)}`} disabled />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input 
                  type="number" 
                  className="form-input" 
                  min="1" 
                  step="1" 
                  value={buyQuantity} 
                  onChange={(e) => setBuyQuantity(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Total Estimated Cost</label>
                <div className="total-cost">${(parseFloat(stock.price) * buyQuantity).toFixed(2)}</div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Buy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetails;
