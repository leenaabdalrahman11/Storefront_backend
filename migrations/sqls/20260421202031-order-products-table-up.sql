CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
  quantity INTEGER NOT NULL,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE
);