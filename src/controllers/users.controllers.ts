import { NextFunction, Request, Response } from 'express'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  ForgotPasswordReqBody,
  LogoutReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  VerifyForgotPasswordReqBody,
  emailVerifyReqBody
} from '~/models/requests/User.request'
import User from '~/models/schemas/User.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'
import { validate } from '~/utils/validation'
import { check, checkSchema } from 'express-validator'

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
    message: USERS_MESSAGES.REGISTER_SUCCESS
  })
}
export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  // lấy refresh_token từ body
  const refresh_token = req.body.refresh_token as string
  // gọi hàm logout, hàm nhận vào refresh_token tìm và xóa
  const result = await userService.logout(refresh_token)
  res.json(result)
}
export const emailVerifyController = async (
  req: Request<ParamsDictionary, any, emailVerifyReqBody>,
  res: Response,
  next: NextFunction
) => {
  // khi mà req vào đc đây nghĩa là email_verify_token đã valid
  // đồng thời trong req sẽ có decode_email_verify_token
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  // tìm xem có user có mã này ko
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (user === null) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  //nếu mà email_verify_token là rỗng: tức là account đã đc verify email trước đó rồi
  //thì mình sẽ trả về status 200 ok, với message là đã verify email trước đó rồi
  //chứ không trả về lỗi, nếu k thì client sẽ bối rối
  if (user.email_verify_token === '') {
    //mặc định là status 200
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await userService.verifyEmail(user_id)
  //để cập nhật lại email_verify_token thành rỗng và tạo ra access_token và refresh_token mới
  //gữi cho người vừa request email verify đang nhập
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS
  })
}
export const resendEmailVerifycontroller = async (req: Request, res: Response, next: NextFunction) => {
  //khi đến đây thì accesstokenValidator đã chạy rồi => access_token đã đc decode
  // nếu qua được hàm này tức là đã qua đc accessTokenValidator
  //và lưu vào req.user, nên trong đó sẽ có user._id để tao sử dụng
  const { user_id } = req.decoded_authorization as TokenPayload //lấy user_id từ decoded_authorization
  //từ user_id này ta sẽ tìm user trong database
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  //nếu k có user thì trả về lỗi 404: not found
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  //nếu user đã verify email trước đó rồi thì trả về lỗi 400: bad request
  if (user.verify == UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  //nếu user chưa verify email thì ta sẽ gữi lại email verify cho họ
  //cập nhật email_verify_token mới và gữi lại email verify cho họ
  const result = await userService.resendEmailVerify(user_id)
  //result chứa message nên ta chỉ cần trả  result về cho client
  return res.json(result)
}
export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  //middleware forgotPasswordValidator đã chạy rồi, nên ta có thể lấy _id từ user đã tìm đc bằng email
  const { _id } = req.user as User
  //cái _id này là objectid, nên ta phải chuyển nó về string
  //chứ không truyền trực tiếp vào hàm forgotPassword
  const result = await userService.forgotPassword((_id as ObjectId).toString())
  return res.json(result)
}
export const verifyForgotPasswordTokenController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  //nếu đã đến bước này nghĩa là ta đã tìm có forgot_password_token hợp lệ
  //và đã lưu vào req.decoded_forgot_password_token
  //thông tin của user
  //ta chỉ cần thông báo rằng token hợp lệ
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  })
}
//trong messages.ts thêm   VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS: 'Verify forgot password token success'

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  //middleware resetPasswordValidator đã chạy rồi, nên ta có thể lấy đc user_id từ decoded_forgot_password_token
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  //vào database tìm user thông qua user_id này và cập nhật lại password mới
  //vì vào database nên ta sẽ code ở user.services
  const result = await userService.resetPassword(user_id, password) //ta chưa code resetPassword
  return res.json(result)
}
