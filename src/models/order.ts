import Client from '../database'

export type Order = {
  id?: number
  status: string
  user_id: number
}

export type OrderProduct = {
  id?: number
  quantity: number
  order_id: number
  product_id: number
}

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM orders'

      const result = await conn.query(sql)
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`)
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM orders WHERE id=($1)'

      const result = await conn.query(sql, [id])
      conn.release()

      const row = result.rows[0]

      return {
        id: Number(row.id),
        status: row.status,
        user_id: Number(row.user_id)
      }
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`)
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      const conn = await Client.connect()
      const sql =
        'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *'

      const result = await conn.query(sql, [o.status, o.user_id])
      conn.release()

      const row = result.rows[0]

      return {
        id: Number(row.id),
        status: row.status,
        user_id: Number(row.user_id)
      }
    } catch (err) {
      throw new Error(`Could not create order. Error: ${err}`)
    }
  }
async update(id: number, o: Order): Promise<Order> {
  try {
    const conn = await Client.connect()
    const sql =
      'UPDATE orders SET status=($1), user_id=($2) WHERE id=($3) RETURNING *'

    const result = await conn.query(sql, [o.status, o.user_id, id])
    conn.release()

    const row = result.rows[0]

    return {
      id: Number(row.id),
      status: row.status,
      user_id: Number(row.user_id)
    }
  } catch (err) {
    throw new Error(`Could not update order ${id}. Error: ${err}`)
  }
}

async delete(id: number): Promise<Order> {
  try {
    const conn = await Client.connect()
    const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *'

    const result = await conn.query(sql, [id])
    conn.release()

    const row = result.rows[0]

    return {
      id: Number(row.id),
      status: row.status,
      user_id: Number(row.user_id)
    }
  } catch (err) {
    throw new Error(`Could not delete order ${id}. Error: ${err}`)
  }
}
  async addProduct(
    quantity: number,
    orderId: number,
    productId: number
  ): Promise<OrderProduct> {
    try {
      const conn = await Client.connect()

      const orderSql = 'SELECT * FROM orders WHERE id=($1)'
      const orderResult = await conn.query(orderSql, [orderId])

      const order = orderResult.rows[0]

      if (!order) {
        conn.release()
        throw new Error(`Order ${orderId} not found`)
      }

      if (order.status !== 'open') {
        conn.release()
        throw new Error(
          `Could not add product ${productId} to order ${orderId} because order status is ${order.status}`
        )
      }

      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'

      const result = await conn.query(sql, [
        quantity,
        orderId,
        productId
      ])

      conn.release()

      const row = result.rows[0]

      return {
        id: Number(row.id),
        quantity: Number(row.quantity),
        order_id: Number(row.order_id),
        product_id: Number(row.product_id)
      }
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}. Error: ${err}`
      )
    }
  }
}