// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/db.js';
import userRoutes from './routes/user.route.js';
import productRoutes from './routes/product.route.js';
import cookieParser from 'cookie-parser';
import orderRoutes from './routes/order.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors(
  {
    origin: ['http://localhost:5173', 'http://localhost:5174' ],
    credentials: true,
  }
));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Shoe Store Backend is Running 🥾');
});

app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
