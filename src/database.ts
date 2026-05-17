import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_TEST_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV
} = process.env

console.log('ENV:', ENV)
console.log('POSTGRES_DB:', POSTGRES_DB)
console.log('POSTGRES_TEST_DB:', POSTGRES_TEST_DB)
console.log('DB USED:', ENV?.trim() === 'test' ? POSTGRES_TEST_DB : POSTGRES_DB)

const client = new Pool({
  host: POSTGRES_HOST,
  database: ENV?.trim() === 'test' ? POSTGRES_TEST_DB : POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
})

export default client