/// <reference types="jasmine" />

import { OrderStore } from '../models/order'
import { ProductStore } from '../models/product'
import { UserStore } from '../models/user'
import Client from '../database'

const orderStore = new OrderStore()
const productStore = new ProductStore()
const userStore = new UserStore()

describe('Order Model', () => {
  let userId: number
  let productId: number
  let orderId: number

  beforeAll(async () => {
    const conn = await Client.connect()

    await conn.query('DELETE FROM order_products')
    await conn.query('DELETE FROM orders')
    await conn.query('DELETE FROM users')
    await conn.query('DELETE FROM products')
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1')
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1')
    await conn.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1')
    await conn.query('ALTER SEQUENCE order_products_id_seq RESTART WITH 1')

    conn.release()

    const user = await userStore.create({
      username: 'orderUser',
      password: '123'
    })

    userId = user.id as number

    const product = await productStore.create({
      name: 'Laptop',
      price: 1000,
      url: 'https://via.placeholder.com/300',
      description: 'Laptop description'
    })

    productId = product.id as number

    const order = await orderStore.create({
      status: 'open',
      user_id: userId
    })

    orderId = order.id as number
  })

  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined()
  })

  it('should have an addProduct method', () => {
    expect(orderStore.addProduct).toBeDefined()
  })

  it('create method should create an order', async () => {
    const result = await orderStore.create({
      status: 'open',
      user_id: userId
    })

    expect(result.status).toEqual('open')
    expect(result.user_id).toEqual(userId)
  })

  it('index method should return a list of orders', async () => {
    const result = await orderStore.index()
    expect(result.length).toBeGreaterThan(0)
  })

  it('show method should return the correct order', async () => {
    const result = await orderStore.show(orderId)
    expect(result.id).toEqual(orderId)
    expect(result.status).toEqual('open')
    expect(result.user_id).toEqual(userId)
  })

  it('should have an update method', () => {
    expect(orderStore.update).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(orderStore.delete).toBeDefined()
  })

  it('update method should update an order', async () => {
    const result = await orderStore.update(orderId, {
      status: 'complete',
      user_id: userId
    })

    expect(result.status).toEqual('complete')
    expect(result.user_id).toEqual(userId)
  })

  it('delete method should delete an order', async () => {
    const created = await orderStore.create({
      status: 'open',
      user_id: userId
    })

    const result = await orderStore.delete(created.id as number)

    expect(result.id).toEqual(created.id)
  })

  it('addProduct should add product to order', async () => {
    const openOrder = await orderStore.create({
      status: 'open',
      user_id: userId
    })

    const openOrderId = openOrder.id as number

    const result = await orderStore.addProduct(
      2,
      openOrderId,
      productId
    )

    expect(result.quantity).toEqual(2)
    expect(result.order_id).toEqual(openOrderId)
    expect(result.product_id).toEqual(productId)
  })
})