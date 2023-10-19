import { createHash } from 'crypto'
import { config } from 'dotenv'
config()

//đoạn code này lấy từ trang chủ của SHA256
function SHA256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}
// hàm mã hóa Pwd
export function hashPwd(password: string) {
  return SHA256(password + process.env.PASSWORD_SECRET)
}
