import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'
import verifyAuthToken from '../middleware/auth'

const store = new OrderStore()

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index()
    res.status(200).json(orders)
  } catch (err) {
    res.status(400).json(err)
  }
}

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(Number(req.params.id))
    res.status(200).json(order)
  } catch (err) {
    res.status(400).json(err)
  }
}

const addProduct = async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.params.id)
    const productId = Number(req.body.productId)
    const quantity = Number(req.body.quantity)

    const addedProduct = await store.addProduct(
      quantity,
      orderId,
      productId
    )

    res.status(200).json(addedProduct)
  } catch (err) {
    res.status(400).json(err)
  }
}
const update = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user

    const order = {
      status: req.body.status,
      user_id: user.id
    }

    const updatedOrder = await store.update(Number(req.params.id), order)
    res.status(200).json(updatedOrder)
  } catch (err) {
    res.status(400).json(err)
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const deletedOrder = await store.delete(Number(req.params.id))
    res.status(200).json(deletedOrder)
  } catch (err) {
    res.status(400).json(err)
  }
}
const create = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user

    const order = {
      status: req.body.status,
      user_id: user.id
    }

    const newOrder = await store.create(order)
    res.status(200).json(newOrder)
  } catch (err) {
    res.status(400).json(err)
  }
}


const orderRoutes = (app: express.Application) => {
  app.get('/orders', verifyAuthToken, index)
  app.get('/orders/:id', verifyAuthToken, show)
  app.post('/orders', verifyAuthToken, create)
  app.post('/orders/:id/products', verifyAuthToken, addProduct)
  app.put('/orders/:id', verifyAuthToken, update)
app.delete('/orders/:id', verifyAuthToken, destroy)
}

export default orderRoutes