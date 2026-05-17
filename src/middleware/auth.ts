import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json('Access denied')
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json('Invalid token format')
    }

    const secret = process.env.TOKEN_SECRET as string

    const decoded = jwt.verify(token, secret)

    ;(req as any).user = decoded

    next()
  } catch {
    return res.status(401).json('Invalid token')
  }
}

export default verifyAuthToken