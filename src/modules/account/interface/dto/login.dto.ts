import { Role } from '../../../../@types/account'

export class LoginDto {
  email: string
  password: string
}

export class LoginResponse {
  id: number
  email: string
  nickname: string
  role: Role
  created_at: Date
  access_token: string
  refresh_token: string
}
