import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  RefreshTokenValidator,
  accessTokenValidator,
  loginValidator,
  registerValidator
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

export default usersRouter
