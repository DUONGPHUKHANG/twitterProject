import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/schemas/Errors'

// trong err thì có status và message
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  //nơi tập kết lỗi từ một nơi trên hệ thống về
  // nếu lỗi nhận đc thuộc dạng ErrorWthStatus thì trả về Status và Message
  if (err instanceof ErrorWithStatus) {
    //nếu err là 1 instance của ErrorWithStatus
    //thì ta sẽ trả về status và message của err đó
    return res.status(err.status).json(omit(err, ['status']))
  }
  //Object.getOwnPropertyNames(err) trả về 1 mảng các key của err
  //forEach sẽ duyệt qua từng key
  Object.getOwnPropertyNames(err).forEach((key) => {
    //và ta sẽ cho các key của err về enumerable = true
    //để ta có thể lấy được các key đó
    Object.defineProperty(err, key, { enumerable: true })
  })
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    // errorInfor: err //truyền vậy là truyền lên cả stack(full lỗi và đường dẫn của file lỗi)
    errorInfor: omit(err, ['stack']) //truyền vậy là chỉ truyền lên message
  })
}
