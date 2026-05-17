/// <reference types="jasmine" />

import supertest from 'supertest'
import app from '../app'
import Client from '../database'

const request = supertest(app)

describe('Endpoints Test', () => {
  let token: string
  let productId: number
  let orderId: number

  beforeAll(async () => {
    const conn = await Client.connect()

    await conn.query('DELETE FROM order_products')
    await conn.query('DELETE FROM orders')
    await conn.query('DELETE FROM products')
    await conn.query('DELETE FROM users')

    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1')
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1')
    await conn.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1')
    await conn.query('ALTER SEQUENCE order_products_id_seq RESTART WITH 1')

    conn.release()

    await request.post('/users').send({
      username: 'testuser',
      password: '123'
    })

    const authResponse = await request
      .post('/users/authenticate')
      .send({
        username: 'testuser',
        password: '123'
      })

    token = authResponse.body
  })

  it('create user endpoint should work', async () => {
    const response = await request
      .post('/users')
      .send({
        username: 'anotheruser',
        password: '123'
      })

    expect(response.status).toBe(200)
  })

  it('authenticate user', async () => {
    const response = await request
      .post('/users/authenticate')
      .send({
        username: 'testuser',
        password: '123'
      })

    expect(response.status).toBe(200)
  })

  it('create product', async () => {
    const response = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Phone',
        price: 500
      })

    expect(response.status).toBe(200)

    productId = response.body.id
  })

  it('get products', async () => {
    const response = await request.get('/products')

    expect(response.status).toBe(200)
  })

  it('create order', async () => {
    const response = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'open'
      })

    expect(response.status).toBe(200)

    orderId = response.body.id
  })

  it('add product to order', async () => {
    if (!productId) {
      const productResponse = await request
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Laptop',
          price: 1000
        })

      productId = productResponse.body.id
    }

    if (!orderId) {
      const orderResponse = await request
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'open'
        })

      orderId = orderResponse.body.id
    }

    const response = await request
      .post(`/orders/${orderId}/products`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: productId,
        quantity: 2
      })

    expect(response.status).toBe(200)
  })
    it('get users endpoint should work', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it('get user by id endpoint should work', async () => {
    const response = await request
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it('get product by id endpoint should work', async () => {
    if (!productId) {
      const productResponse = await request
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Tablet',
          price: 300
        })

      productId = productResponse.body.id
    }

    const response = await request.get(`/products/${productId}`)

    expect(response.status).toBe(200)
  })

  it('get orders endpoint should work', async () => {
    const response = await request
      .get('/orders')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })
})