import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifycontroller,
  resetPasswordController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import {
  RefreshTokenValidator,
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middleware'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { wrapAsync } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.get('/login', loginValidator, wrapAsync(loginController))

usersRouter.post(
  '/register',
  registerValidator,
  wrapAsync(registerController)

  // nếu next thường chỉ xuống tầng handler típ theo
  // còn nếu đặt err thì nó sẽ dồn về tầng dành để in ra lỗi (nơi tập kết lỗi)
  // --> bản chất middleware và controller giống nhau
  // hàm err là hàm tập kết lỗi
)
/*
des: đăng xuất
path: /users/logout
method: POST
Header: (Authorization: 'Bearer <access_token>')
body: {refresh_token: string}
*/
usersRouter.post('/logout', accessTokenValidator, RefreshTokenValidator, wrapAsync(logoutController))

/*
des: verify email
khi người dùng đăng kí, trong email của họ sẽ có 1 link
  trong link này đã setup sẵn 1 request kèm email_verify_token
  thì verify_email là cái route cho request đó
method: POST 
path: /users/verify-email
body: {email_verify_token: string}
*/
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController))

/*
des: resend Email verify
method: POST
headers: {Authorization: Bearer <access_token>}
*/

usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifycontroller))
/*
des: cung cấp email để reset password, gữi email cho người dùng
path: /forgot-password
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {email: string}
*/
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/*
des: Verify link in email to reset password
path: /verify-forgot-password
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string}
*/
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)

/*
des: reset password
path: '/reset-password'
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string, password: string, confirm_password: string}
*/
usersRouter.post('/reset-password', resetPasswordValidator, wrapAsync(resetPasswordController))

export default usersRouter
