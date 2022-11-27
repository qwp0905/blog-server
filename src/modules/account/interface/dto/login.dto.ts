import { AccountRole } from '../../../../@types/account'

export class LoginDto {
  email: string
  password: string
}

export class LoginResponse {
  id: number
  email: string
  nickname: string
  role: AccountRole
  created_at: Date
  access_token: string
  refresh_token: string
}
