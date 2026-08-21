import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getWatchlist, removeFromWatchlist } from '../services/api';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const data = await getWatchlist();
      // Backend returns { stocks: [...], user, ... } — extract the stocks array
      setWatchlist(data?.stocks || data || []);
    } catch (err) {
      // Mock data for UI development
      setWatchlist([
        { id: 1, symbol: 'TSLA', name: 'Tesla Inc.', price: 238.82 },
        { id: 2, symbol: 'AMZN', name: 'Amazon.com Inc.', price: 131.69 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (e, id) => {
    e.stopPropagation(); // Prevent card click
    try {
      await removeFromWatchlist(id);
      fetchWatchlist();
    } catch (err) {
      // Optimistic update for mock
      setWatchlist(watchlist.filter(item => item._id !== id && item.id !== id));
    }
  };

  return (
    <div className="watchlist-page page-container">
      <div className="page-header">
        <h1 className="page-title">My Watchlist</h1>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading watchlist...</div>
      ) : watchlist.length === 0 ? (
        <div className="empty-state">
          <p>Your watchlist is empty. Search for stocks to add them.</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
            Explore Market
          </button>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map(stock => (
            <div 
              key={stock._id || stock.symbol} 
              className="watchlist-card"
              onClick={() => navigate(`/stock/${stock.symbol}`)}
            >
              <div className="watchlist-card-header">
                <div>
                  <h3 className="watchlist-symbol">{stock.symbol}</h3>
                  <div className="watchlist-name">{stock.name}</div>
                </div>
                <button 
                  className="btn-icon btn-danger" 
                  onClick={(e) => handleRemove(e, stock._id)}
                  title="Remove from watchlist"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="watchlist-price">
                ${parseFloat(stock.price || 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
