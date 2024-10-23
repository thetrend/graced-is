import * as jwt from 'jsonwebtoken'

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

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, accessTokenSecret) as { userId: string }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error verifying access token: ', error)
    return null
  }
}

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, refreshTokenSecret) as { userId: string }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error verifying refresh token: ', error)
    return null
  }
}
