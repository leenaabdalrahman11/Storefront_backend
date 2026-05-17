import Client from '../database'

export type Product = {
  id?: number
  name: string
  price: number
  url: string
  description: string
  quantity?: number
}
export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM products'

      const result = await conn.query(sql)
      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`)
    }
  }
async show(id: number): Promise<Product> {
    try {
      const conn = await Client.connect()
      const sql = 'SELECT * FROM products WHERE id=($1)'

      const result = await conn.query(sql, [id])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`)
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const conn = await Client.connect()
const sql =
  'INSERT INTO products (name, price, url, description) VALUES($1, $2, $3, $4) RETURNING *'

const result = await conn.query(sql, [
  p.name,
  p.price,
  p.url,
  p.description
])
      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not add new product ${p.name}. Error: ${err}`)
    }
  }
  async update(id: number, p: Product): Promise<Product> {
  try {
    const conn = await Client.connect()
const sql =
  'UPDATE products SET name=($1), price=($2), url=($3), description=($4) WHERE id=($5) RETURNING *'

const result = await conn.query(sql, [
  p.name,
  p.price,
  p.url,
  p.description,
  id
])
    conn.release()

    return result.rows[0]
  } catch (err) {
    throw new Error(`Could not update product ${id}. Error: ${err}`)
  }
}

async delete(id: number): Promise<Product> {
  try {
    const conn = await Client.connect()
    const sql = 'DELETE FROM products WHERE id=($1) RETURNING *'

    const result = await conn.query(sql, [id])
    conn.release()

    return result.rows[0]
  } catch (err) {
    throw new Error(`Could not delete product ${id}. Error: ${err}`)
  }
}
}