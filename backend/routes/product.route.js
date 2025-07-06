// routes/product.route.js
import express from 'express';
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
} from '../controllers/product.controller.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

// Public route to get all products
router.get('/getall', getAllProducts);
router.get('/getall/:id', getProductById);

// Protected routes
router.post('/upload', isAdmin, createProduct);
router.put('/update/:id', isAdmin, updateProduct);
router.delete('/delete/:id', isAdmin, deleteProduct);

export default router;
