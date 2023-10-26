import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middleware'
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

usersRouter.get('/tweets', (req, res) => {
  res.json({
    data: [
      { fname: 'Điệp', yob: 1999 },
      { fname: 'Hùng', yob: 2003 },
      { fname: 'Được', yob: 1994 }
    ]
  })
})

export default usersRouter
