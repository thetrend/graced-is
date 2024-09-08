import jwt from 'jsonwebtoken'

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN as string
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN as string

export const generateAccessToken = (userId: string) =>
  jwt.sign({ userId }, accessTokenSecret, {
    expiresIn: accessTokenExpiresIn,
  })

export const generateRefreshToken = (userId: string) =>
  jwt.sign({ userId }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiresIn,
  })

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, accessTokenSecret) as { userId: string }

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, refreshTokenSecret) as { userId: string }
