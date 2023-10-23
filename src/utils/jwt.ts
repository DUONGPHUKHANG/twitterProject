import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
config()

// hàm kí tên
export const signToken = ({
  payload, //data
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  // có dấu chấm ? là ko bắt buộc pải có | còn ko thì bắt buộc
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) throw reject(err)
      resolve(token as string)
    })
  })
}
