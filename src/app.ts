import express from 'express'
import cors from 'cors'
import productRoutes from './handlers/products'
import userRoutes from './handlers/users'
import orderRoutes from './handlers/orders'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Server is running')
})

productRoutes(app)
userRoutes(app)
orderRoutes(app)

export default app