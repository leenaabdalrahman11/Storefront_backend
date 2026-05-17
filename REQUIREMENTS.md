## Products
GET /products
GET /products/:id
POST /products (token required)
PUT /products/:id (token required)
DELETE /products/:id (token required)

## Users
POST /users
POST /users/authenticate
GET /users (token required)
GET /users/:id (token required)
PUT /users/:id (token required)
DELETE /users/:id (token required)

## Orders
GET /orders (token required)
POST /orders (token required)
POST /orders/:id/products (token required)
PUT /orders/:id (token required)
DELETE /orders/:id (token required)

## Database Schema

Table: users
- id (serial primary key)
- username (varchar)
- password_digest (varchar)

Table: products
- id (serial primary key)
- name (varchar)
- price (integer)

Table: orders
- id (serial primary key)
- status (varchar)
- user_id (foreign key->users.id)

Table: order_products
- id (serial primary key)
- quantity (integer)
- order_id (foreign key->orders.id)
- product_id (foreign key->products.id)

## Data Shapes

Product:
- id
- name
- price

User:
- id
- username
- password

Order:
- id
- user_id
- status
- products (list with quantity)

## Database Setup

Run migrations:
npx db-migrate up

Tables are created using migration files:
- users
- products
- orders
- order_products