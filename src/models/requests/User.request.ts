import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

// file này dùng để định nghĩa req body | params | query
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}
//định nghĩa req cho thằng logoutController
export interface LogoutReqBody {
  refresh_token: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
