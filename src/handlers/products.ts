import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'
import verifyAuthToken from '../middleware/auth'

const store = new ProductStore()

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index()
    res.json(products)
  } catch (err) {
    console.error('GET /products error:', err)
    res.status(400).json({
      message: String(err)
    })
  }
}

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(Number(req.params.id))
    res.json(product)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

const create = async (req: Request, res: Response) => {
  try {
const product: Product = {
  name: req.body.name,
  price: req.body.price,
  url: req.body.url,
  description: req.body.description
}

    const newProduct = await store.create(product)
    res.json(newProduct)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}
const update = async (req: Request, res: Response) => {
  try {
const product: Product = {
  name: req.body.name,
  price: req.body.price,
  url: req.body.url,
  description: req.body.description
}

    const updatedProduct = await store.update(Number(req.params.id), product)
    res.json(updatedProduct)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await store.delete(Number(req.params.id))
    res.json(deletedProduct)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}
const productRoutes = (app: express.Application) => {
  app.get('/products', index)
  app.get('/products/:id', show)
  app.post('/products', verifyAuthToken, create)
  app.put('/products/:id', verifyAuthToken, update)
  app.delete('/products/:id', verifyAuthToken, destroy)
}

export default productRoutes