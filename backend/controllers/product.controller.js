// controllers/product.controller.js
import pool from '../db/db.js';
import { v4 as uuidv4 } from 'uuid';

// Create Product
export const createProduct = async (req, res) => {
  try {
    let {
      product_name,
      category,
      price,
      discount_percentage,
      stock_quantity,
      product_images,
      description,
      is_featured,
      available_sizes,
    } = req.body;

    // Calculate discounted price
    const discountAmount = (price * (discount_percentage || 0)) / 100;
    price = price - discountAmount; // Update price to be the discounted price

    const newProduct = await pool.query(
      `INSERT INTO products 
      (id, product_name, category, price, discount_percentage, stock_quantity, product_images, description, is_featured, available_sizes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        uuidv4(),
        product_name,
        category,
        price, // Now contains the discounted price
        discount_percentage,
        stock_quantity,
        product_images,
        description,
        is_featured,
        available_sizes,
      ]
    );

    res.status(201).json({success:true, message: 'Product created', product: newProduct.rows[0] });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json({success:true, products: result.rows });
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
// console.log('Update product body:', req.body);

    let {
      product_name,
      category,
      price,
      discount_percentage,
      stock_quantity,
      product_images,
      description,
      is_featured,
      available_sizes,
    } = req.body;

    // Calculate discounted price
    const discountAmount = (price * (discount_percentage || 0)) / 100;
    price = price - discountAmount; // Update price to be the discounted price


    const updated = await pool.query(
      `UPDATE products SET
        product_name = $1,
        category = $2,
        price = $3,
        discount_percentage = $4,
        stock_quantity = $5,
        product_images = $6,
        description = $7,
        is_featured = $8,
        available_sizes = $9
      WHERE id = $10
      RETURNING *`,
      [
        product_name,
        category,
        price, // Now contains the discounted price
        discount_percentage,
        stock_quantity,
        product_images,
        description,
        is_featured,
        available_sizes,
        id,
      ]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({success:true, message: 'Product updated', product: updated.rows[0] });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted', product: deleted.rows[0] });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({success:true, product: result.rows[0] });
  } catch (err) {
    console.error('Fetch product by ID error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};