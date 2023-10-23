import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/schemas/Errors'

// can be reused by many routes
// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    const errorObject = errors.mapped() //hàm này giúp ta lấy lỗi ra dưới dạng object
    //xử lý object lỗi
    for (const key in errorObject) {
      //phân rã msg của 1 cái lỗi ra
      const { msg } = errorObject[key]
      //"msg instanceof ErrorWithStatus " vừa giúp mình biết rằng có lỗi k, mà vừa định
      //và khi tường minh thì msg có thể .status được
      //nếu có lỗi của ErrorWithStatus thì mình return và next(msg): ném lỗi cho defaul
      //thay vì để nó chạy xuống và res.status(422).....
      //nhờ vậy mà nếu có lỗi gì khác error do validator tạo ra thì nó sẽ k vào lỗi 422
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
    }
    if (errors.isEmpty()) {
      return next()
    }
    res.status(422).json({ errors: errorObject })
  }
}
// mapped trả về lỗi có format đẹp hơn thằng array
