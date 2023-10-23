import { NextFunction, Request, Response } from 'express'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.request'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'Khangbinh261@gmail.com' && password === '123123') {
    res.json({
      data: [
        { fname: 'Điệp', yob: 1999 },
        { fname: 'Hùng', yob: 2003 },
        { fname: 'Được', yob: 1994 }
      ]
    })
  } else {
    res.status(400).json({
      message: 'login Failed'
    })
  }
}
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  // throw new Error('tạo thử 1 cái lỗi nè')
  const result = await userService.register(req.body) // thay luôn
  console.log(result)
  return res.status(400).json({
    message: 'Register success',
    result: result
  })
}
