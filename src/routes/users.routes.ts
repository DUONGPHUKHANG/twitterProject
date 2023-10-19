import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middleware'

const usersRouter = Router()

usersRouter.get('/login', loginValidator, loginController)
usersRouter.post('/register', registerValidator, registerController)
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
