const request = require('supertest');
const express = require('express');

jest.mock('../models/Portfolio');
const Portfolio = require('../models/Portfolio');

const { getPortfolio, addStock, removeStock } = require('../controllers/portfolioController');

const app = express();
app.use(express.json());

// Mock middleware that sets req.user
app.use((req, res, next) => {
  req.user = { _id: 'user123' };
  next();
});

app.get('/api/portfolio', getPortfolio);
app.post('/api/portfolio/add', addStock);
app.delete('/api/portfolio/remove/:stockId', removeStock);

describe('Portfolio Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/portfolio', () => {
    it('should return user portfolio', async () => {
      Portfolio.findOne.mockResolvedValue({ user: 'user123', stocks: [] });

      const res = await request(app).get('/api/portfolio');

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBe('user123');
    });
  });

  describe('POST /api/portfolio/add', () => {
    it('should add a stock to portfolio', async () => {
      const mockPortfolio = {
        user: 'user123',
        stocks: [],
        save: jest.fn().mockResolvedValue(true)
      };
      
      Portfolio.findOne.mockResolvedValue(mockPortfolio);

      const res = await request(app)
        .post('/api/portfolio/add')
        .send({
          symbol: 'AAPL',
          name: 'Apple',
          quantity: 10,
          buyPrice: 150
        });

      expect(res.statusCode).toBe(201);
      expect(mockPortfolio.stocks.length).toBe(1);
      expect(mockPortfolio.stocks[0].symbol).toBe('AAPL');
      expect(mockPortfolio.save).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/portfolio/remove/:stockId', () => {
    it('should remove a stock', async () => {
      const mockPortfolio = {
        user: 'user123',
        stocks: {
          pull: jest.fn()
        },
        save: jest.fn().mockResolvedValue(true)
      };
      
      Portfolio.findOne.mockResolvedValue(mockPortfolio);

      const res = await request(app).delete('/api/portfolio/remove/stock123');

      expect(res.statusCode).toBe(200);
      expect(mockPortfolio.stocks.pull).toHaveBeenCalledWith('stock123');
      expect(mockPortfolio.save).toHaveBeenCalled();
    });
  });
});
