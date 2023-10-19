import { Request, Response } from 'express'
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
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  // const { email, password, name } = req.body thay thế bằng RegisterReqBody
  try {
    // tạo 1 user mới bỏ vào collection users trong database
    const result = await userService.register(req.body)
    return res.json({ message: 'thêm ngon lành', result })
  } catch (err) {
    res.status(400).json({ message: 'Sai ròi má ơi', err })
  }
}
