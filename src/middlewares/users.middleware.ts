// 1 ai đố truy cập vào /login
// Client sẽ gửi -> cho mình  email và password
//  Client sẽ tạo 1 req gửi server
// thì username và password sẽ nằm pử req.body
// viết 1 middleware xử lý validator của req.body
import { checkSchema } from 'express-validator'
import { Response, Request, NextFunction } from 'express'
import { validate } from '~/utils/validation'
import userService from '~/services/users.services'
import { ErrorWithStatus } from '~/models/schemas/Errors'

//viết 1 middleware xử lý validator login
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: 'missing email or password'
    })
  }
  next()
}
// khi register lỗi
// ta sẽ truyền 1 req.body
// {
//   name: string
//   email: string,
//   password: string,
// };
export const registerValidator = validate(
  // validate bọc checkSchema để kiểm Schema có lỗi ko
  // và validate sẽ lưu lỗi cho người dùng biết
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      }
    },
    email: {
      isEmail: true,
      notEmpty: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const isExistEmail = await userService.checkEmail(value)
          if (isExistEmail) {
            throw new Error('Email already exists')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
          // returnScore: true
        }
      },
      isLength: {
        options: {
          min: 8,
          max: 30
        }
      },
      errorMessage: 'pwsd must be at least 8 chars long, contain at least 1 lowercase letter, 1 uppercase letter'
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          returnScore: true
          // chấm điểm password mạnh yếu
        }
      },
      errorMessage:
        'password mus be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('confirm_password does not match password')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
