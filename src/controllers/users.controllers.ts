import { NextFunction, Request, Response } from 'express'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.request'
import User from '~/models/schemas/User.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'

export const loginController = async (req: Request, res: Response) => {
  //  vào req lấy user ra , và lấy _id của user đó

  const user = req.user as User
  const user_id = user._id as ObjectId
  // dùng cái user_id đã tạo access_token và refresh_token
  const result = await userService.login(user_id.toString())
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  // throw new Error('tạo thử 1 cái lỗi nè')
  const result = await userService.register(req.body) // thay luôn
  return res.status(400).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}
