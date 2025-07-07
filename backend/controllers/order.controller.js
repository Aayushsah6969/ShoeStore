// controllers/order.controller.js
import pool from '../db/db.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new order
 */
export const createOrder = async (req, res) => {
  const { order_items } = req.body;
  const userId = req.user.id;

  try {
    if (!order_items || !Array.isArray(order_items) || order_items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    const orderSnapshot = [];
    let total_price = 0;

    for (const item of order_items) {
      const { product_id, size, quantity } = item;

      if (!product_id || !size || !quantity) {
        return res.status(400).json({ message: 'Missing product_id, size or quantity in item' });
      }

      const productRes = await pool.query(
        'SELECT id, product_name, price, product_images FROM products WHERE id = $1',
        [product_id]
      );

      if (productRes.rows.length === 0) {
        return res.status(404).json({ message: `Product with ID ${product_id} not found` });
      }

      const product = productRes.rows[0];

      const itemTotal = product.price * quantity;
      total_price += itemTotal;

      orderSnapshot.push({
        product_id: product.id,
        product_name: product.product_name,
        image: product.product_images[0], // now correct
        price_at_purchase: product.price,
        quantity,
        size,
      });
    }

    const newOrder = await pool.query(
      `INSERT INTO orders (id, user_id, order_items, total_price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [uuidv4(), userId, JSON.stringify(orderSnapshot), total_price]
    );

    res.status(201).json({ success: true, order: newOrder.rows[0] });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Admin updates delivery status
 */
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { delivery_status } = req.body;

  try {
    const updated = await pool.query(
      `UPDATE orders SET delivery_status = $1 WHERE id = $2 RETURNING *`,
      [delivery_status, id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order status updated', order: updated.rows[0] });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Admin gets all orders
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await pool.query(
      `SELECT 
         orders.*, 
         users.full_name AS customer_name, 
         users.email AS customer_email, 
         users.id AS user_id 
       FROM orders
       JOIN users ON orders.user_id = users.id
       ORDER BY orders.created_at DESC`
    );

    res.json({ success: true, orders: orders.rows });
  } catch (err) {
    console.error('Fetch all orders error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/**
 * User cancels their own order if still pending
 */
export const cancelOrder = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;

  try {
    const order = await pool.query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found or not yours' });
    }

    if (order.rows[0].delivery_status !== 'processing') {
      return res.status(400).json({ message: 'Order cannot be cancelled after processing' });
    }

    const deleted = await pool.query(
      `DELETE FROM orders WHERE id = $1 RETURNING *`,
      [id]
    );

    res.json({ success: true, message: 'Order cancelled', order: deleted.rows[0] });
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * (Optional) Get logged-in user's order history
 */
export const getMyOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ success: true, orders: result.rows });
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
