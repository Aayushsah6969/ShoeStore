-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  order_items jsonb NOT NULL,
  total_price numeric NOT NULL,
  payment_status text DEFAULT 'completed'::text,
  delivery_status text DEFAULT 'processing'::text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  product_name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  discount_percentage integer DEFAULT 0,
  stock_quantity integer NOT NULL,
  product_images ARRAY NOT NULL,
  description text,
  is_featured boolean DEFAULT false,
  available_sizes ARRAY,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  reset_password_token text,
  reset_password_expires timestamp without time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);