///Leena Abd Alrahman 

Storefront Backend API
## Project Description
This is a backend API for an online store application built with Node.js, Express, TypeScript, and PostgreSQL.  
It provides endpoints for managing users, products, and orders, with JWT authentication and password hashing using bcrypt.

##Technologies Used
 Node.js
 Express
 TypeScript
 PostgreSQL
 db-migrate
 Jasmine
 Supertest
 bcrypt
 JSON Web Token

Install:

npm install

Run:

npm run watch
[http://localhost:3000](http://localhost:3000)

Database:

PostgreSQL
storefront_dev
storefront_test

Migrate:
npx db-migrate up

Test:

npm test

Env:

Add .env file (DB info + JWT + bcrypt)

Notes:

Uses JWT auth
Passwords are hashed

env:

POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

ENV=dev
BCRYPT_PASSWORD=leena_storefront_pepper_2026
SALT_ROUNDS=10
TOKEN_SECRET=leena_storefront_jwt_secret_2026
PORT=3000