import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifycontroller,
  resetPasswordController,
  updateMeController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  RefreshTokenValidator,
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middleware'
import { UpdateMeReqBody } from '~/models/requests/User.request'
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
/*
des: get profile của user
path: '/me'
method: get
Header: {Authorization: Bearer <access_token>}
body: {}
*/
usersRouter.get('/me', accessTokenValidator, wrapAsync(getMeController))

// usersRouter.patch('/me', accessTokenValidator, verifiedUserValidator, updateMeValidator, wrapAsync(updateMeController))
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'avatar',
    'username',
    'cover_photo'
  ]),
  updateMeValidator,
  wrapAsync(updateMeController)
)

/*
des: get profile của user khác bằng unsername
path: '/:username'
method: get
không cần header vì, chưa đăng nhập cũng có thể xem
*/
usersRouter.get('/:username', wrapAsync(getProfileController))
//chưa có controller getProfileController, nên bây giờ ta làm

export default usersRouter
