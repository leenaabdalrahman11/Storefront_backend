/// <reference types="jasmine" />
import { ProductStore } from '../models/product'
import Client from '../database'

const store = new ProductStore()

describe('Product Model', () => {
  let createdProductId: number

  beforeAll(async () => {
    const conn = await Client.connect()

    await conn.query('DELETE FROM order_products')
    await conn.query('DELETE FROM products')
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1')

    conn.release()

    const product = await store.create({
      name: 'Phone',
      price: 500,
      url: 'https://via.placeholder.com/300',
      description: 'Phone description'
    })

    createdProductId = product.id as number
  })

  it('should have an index method', () => {
    expect(store.index).toBeDefined()
  })

  it('should have a show method', () => {
    expect(store.show).toBeDefined()
  })

  it('should have a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('create method should add a product', async () => {
    const result = await store.create({
      name: 'Tablet',
      price: 300,
      url: 'https://via.placeholder.com/300',
      description: 'Tablet description'
    })

    expect(result.name).toEqual('Tablet')
    expect(Number(result.price)).toEqual(300)
    expect(result.url).toEqual('https://via.placeholder.com/300')
    expect(result.description).toEqual('Tablet description')
  })

  it('index method should return a list of products', async () => {
    const result = await store.index()
    expect(result.length).toBeGreaterThan(0)
  })

  it('show method should return the correct product', async () => {
    const result = await store.show(createdProductId)

    expect(result.name).toEqual('Phone')
    expect(Number(result.price)).toEqual(500)
    expect(result.url).toEqual('https://via.placeholder.com/300')
    expect(result.description).toEqual('Phone description')
  })

  it('should have an update method', () => {
    expect(store.update).toBeDefined()
  })

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined()
  })

  it('update method should update a product', async () => {
    const result = await store.update(createdProductId, {
      name: 'Updated Phone',
      price: 700,
      url: 'https://via.placeholder.com/300',
      description: 'Updated phone description'
    })

    expect(result.name).toEqual('Updated Phone')
    expect(Number(result.price)).toEqual(700)
    expect(result.description).toEqual('Updated phone description')
  })

  it('delete method should remove a product', async () => {
    const product = await store.create({
      name: 'To Delete',
      price: 100,
      url: 'https://via.placeholder.com/300',
      description: 'Product to delete'
    })

    const result = await store.delete(product.id as number)

    expect(result.name).toEqual('To Delete')
  })
})