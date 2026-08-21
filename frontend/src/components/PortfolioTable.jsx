import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PortfolioTable = ({ stocks, onRemove }) => {
  const navigate = useNavigate();

  if (!stocks || stocks.length === 0) {
    return (
      <div className="empty-state">
        <p>Your portfolio is empty.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Discover Stocks
        </button>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Qty</th>
            <th>Buy Price</th>
            <th>Current Price</th>
            <th>Total Value</th>
            <th>P&L</th>
            <th>P&L %</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const currentPrice = parseFloat(stock.currentPrice || stock.buyPrice);
            const buyPrice = parseFloat(stock.buyPrice);
            const qty = parseFloat(stock.quantity);
            const totalValue = currentPrice * qty;
            const pl = (currentPrice - buyPrice) * qty;
            const plPercent = ((currentPrice - buyPrice) / buyPrice) * 100;
            const isProfit = pl >= 0;

            return (
              <tr key={stock.id || stock.symbol}>
                <td 
                  className="table-symbol" 
                  onClick={() => navigate(`/stock/${stock.symbol}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {stock.symbol}
                </td>
                <td className="table-name">{stock.name}</td>
                <td>{qty}</td>
                <td>${buyPrice.toFixed(2)}</td>
                <td>${currentPrice.toFixed(2)}</td>
                <td>${totalValue.toFixed(2)}</td>
                <td className={isProfit ? 'text-profit' : 'text-loss'}>
                  {isProfit ? '+' : ''}${pl.toFixed(2)}
                </td>
                <td className={isProfit ? 'text-profit' : 'text-loss'}>
                  {isProfit ? '+' : ''}{plPercent.toFixed(2)}%
                </td>
                <td>
                  <button 
                    className="btn-icon btn-danger" 
                    onClick={() => onRemove(stock.id)}
                    title="Remove from portfolio"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;
