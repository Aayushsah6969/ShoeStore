import pool from '../db/db.js';

export const getDashboardData = async (req, res) => {
  try {
    // Total Products
    const totalProductsRes = await pool.query('SELECT COUNT(*) FROM products');
    const totalProducts = parseInt(totalProductsRes.rows[0].count);

    // Total Orders
    const totalOrdersRes = await pool.query('SELECT COUNT(*) FROM orders');
    const totalOrders = parseInt(totalOrdersRes.rows[0].count);

    // Total Sales (sum from order table itself)
    const totalSalesRes = await pool.query(`
      SELECT COALESCE(SUM(total_price), 0) AS total_sales FROM orders
    `);
    const totalSales = parseFloat(totalSalesRes.rows[0].total_sales);

    // Low Stock Items (stock_quantity < 10)
    const lowStockRes = await pool.query(`
      SELECT COUNT(*) FROM products WHERE stock_quantity < 10
    `);
    const lowStockItems = parseInt(lowStockRes.rows[0].count);

    return res.json({
      success: true,
      totalProducts,
      totalOrders,
      totalSales,
      lowStockItems,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getPaymentsOverview = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id AS order_id,
        u.full_name AS customer_name,
        u.email,
        o.total_price,
        o.created_at,
        o.payment_status
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      payments: result.rows
    });
  } catch (err) {
    console.error('Error fetching payments overview:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};