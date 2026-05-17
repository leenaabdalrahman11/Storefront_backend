import Client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

export type User = {
  id?: number;
  username: string;
  password: string;
};

export type SafeUser = {
  id: number;
  username: string;
};

export class UserStore {
  async create(u: User): Promise<SafeUser> {
    try {
      const conn = await Client.connect();

      const sql =
        "INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING id, username";

      const hash = bcrypt.hashSync(u.password + pepper, saltRounds);

      const result = await conn.query(sql, [u.username, hash]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create user ${u.username}. Error: ${err}`);
    }
  }

async authenticate(
  username: string,
  password: string
): Promise<SafeUser | null> {
  try {
    const conn = await Client.connect();

    const sql = "SELECT * FROM users WHERE username=$1";
    const result = await conn.query(sql, [username]);

    conn.release();

    if (result.rows.length === 0) return null;

    const user = result.rows[0];

    const isValid = bcrypt.compareSync(password + pepper, user.password_digest);

    if (!isValid) return null;

    return {
      id: user.id,
      username: user.username,
    };
  } catch (err) {
    throw new Error(`Could not authenticate user ${username}. Error: ${err}`);
  }
}
  async index(): Promise<SafeUser[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT id, username FROM users";

      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: number): Promise<SafeUser> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT id, username FROM users WHERE id=($1)";

      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async update(id: number, u: User): Promise<SafeUser> {
    try {
      const conn = await Client.connect();
      const hash = bcrypt.hashSync(u.password + pepper, saltRounds);

      const sql =
        "UPDATE users SET username=($1), password_digest=($2) WHERE id=($3) RETURNING id, username";

      const result = await conn.query(sql, [u.username, hash, id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not update user ${id}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<SafeUser> {
    try {
      const conn = await Client.connect();
      const sql = "DELETE FROM users WHERE id=($1) RETURNING id, username";

      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
}
