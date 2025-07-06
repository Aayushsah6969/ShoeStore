// routes/order.route.js
import express from 'express';
import {
  createOrder,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
  getMyOrders,
} from '../controllers/order.controller.js';

import auth from '../middlewares/auth.js';      // Authenticated user middleware
import isAdmin from '../middlewares/isAdmin.js'; // Admin-only access middleware

const router = express.Router();

// User Routes
router.post('/create', auth, createOrder);               // Place a new order
router.get('/my-orders', auth, getMyOrders);       // Get logged-in user's orders
router.delete('/cancel/:id', auth, cancelOrder);          // Cancel an order (if allowed)

// Admin Routes
router.get('/getAllOrders', isAdmin, getAllOrders);            // Admin gets all orders
router.put('/update/:id', isAdmin, updateOrderStatus); // Admin updates order status

export default router;
