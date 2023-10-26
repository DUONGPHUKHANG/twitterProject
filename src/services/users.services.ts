import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.request'
import { hashPwd } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import { config } from 'dotenv'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
config

class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCEPT_TOKEN_EXPIRE_IN }
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
    })
  }
  private signAccessAndRefresh(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  async register(payload: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        // trong RegisterReqBody đã có sẵn DoBirth nên mình
        // cho DoBirth sẽ gán bằng Date_of_birth
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPwd(payload.password)
      })
    )
    // lấy user_id từ account vừa tạo
    const user_id = result.insertedId.toString()
    // từ user_id tạo 1 accessToken và 1 refreshToken

    const [access_Token, refresh_token] = await this.signAccessAndRefresh(user_id)
    databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )
    return { access_Token, refresh_token }
  }
  async checkEmail(email: string) {
    // vào database tìm user có email này
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
  async login(user_id: string) {
    // dùng cái user_id đó tạo access_token và refresh_token
    const [access_Token, refresh_token] = await this.signAccessAndRefresh(user_id)
    return { access_Token, refresh_token }
  }
}
const userService = new UserService()
export default userService
