import { jest } from '@jest/globals';
import { getDashboardData, getPaymentsOverview } from '../controllers/data.controller.js';

// Mock database query
const mockQuery = jest.fn();

// Mock the db module
jest.unstable_mockModule('../db/db.js', () => ({
  default: { query: mockQuery }
}));

// Import the mocked db module AFTER defining the mock
const { default: pool } = await import('../db/db.js');

describe('Dashboard Controller Tests', () => {
  let req = {};
  let res;

  beforeEach(() => {
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    mockQuery.mockReset();
  });

  test('getDashboardData should return correct dashboard stats', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ count: '10' }] }) // total products
      .mockResolvedValueOnce({ rows: [{ count: '20' }] }) // total orders
      .mockResolvedValueOnce({ rows: [{ total_sales: '4500.50' }] }) // total sales
      .mockResolvedValueOnce({ rows: [{ count: '3' }] }); // low stock

    await getDashboardData(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      totalProducts: 10,
      totalOrders: 20,
      totalSales: 4500.5,
      lowStockItems: 3
    });
  });

  test('getPaymentsOverview should return payment rows', async () => {
    const samplePayments = [
      {
        order_id: '123',
        customer_name: 'Aayush',
        email: 'aayush@example.com',
        total_price: 100.5,
        created_at: '2024-06-01',
        payment_status: 'completed'
      }
    ];

    mockQuery.mockResolvedValueOnce({ rows: samplePayments });

    await getPaymentsOverview(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      payments: samplePayments
    });
  });

  test('getDashboardData should handle db error', async () => {
    mockQuery.mockRejectedValueOnce(new Error('DB Error'));

    await getDashboardData(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Server error'
    });
  });
});
