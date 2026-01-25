import * as dotenv from 'dotenv'

dotenv.config()

export const HTTP_PORT = process.env.HTTP_PORT
export const WS_PORT = process.env.WS_PORT
export const DATABASE_URL = process.env.DATABASE_URL
export const JWT_SECRET = process.env.JWT_SECRET

