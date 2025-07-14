-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- Ensure required extension for UUIDs is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  reset_password_token text,
  reset_password_expires timestamp
);

-- PRODUCTS TABLE
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  discount_percentage integer DEFAULT 0,
  stock_quantity integer NOT NULL,
  product_images text[] NOT NULL,  -- ARRAY type must have a base type like text[]
  description text,
  is_featured boolean DEFAULT false,
  available_sizes text[],          -- Add base type to array (e.g., text[])
  created_at timestamp DEFAULT now()
);

-- ORDERS TABLE
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id),
  order_items jsonb NOT NULL,
  total_price numeric NOT NULL,
  payment_status text DEFAULT 'completed',
  delivery_status text DEFAULT 'processing',
  created_at timestamp DEFAULT now()
);
