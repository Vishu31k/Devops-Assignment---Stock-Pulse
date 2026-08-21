import React from 'react';
import { useNavigate } from 'react-router-dom';

const StockCard = ({ symbol, name, price, change, changePercent }) => {
  const navigate = useNavigate();
  const isPositive = change >= 0;
  
  const handleClick = () => {
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="stock-card" onClick={handleClick}>
      <div className="stock-card-header">
        <h3 className="stock-symbol">{symbol}</h3>
        <span className="stock-name" title={name}>{name}</span>
      </div>
      <div className="stock-card-body">
        <div className="stock-price">${parseFloat(price).toFixed(2)}</div>
        <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{parseFloat(change).toFixed(2)} ({isPositive ? '+' : ''}{parseFloat(changePercent).toFixed(2)}%)
        </div>
      </div>
    </div>
  );
};

export default StockCard;
