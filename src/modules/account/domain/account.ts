import * as bcrypt from 'bcrypt'
import { Role } from '../../../@types/account'
import {
  Http400Exception,
  Http403Exception,
  Http404Exception
} from '../../../shared/lib/http.exception'

export interface IAccountEssentialProperties {
  email: string
  password: string
  nickname: string
}

export interface IAccountOptionalProperties {
  id?: number
  role?: Role
  created_at?: Date
  updated_at?: Date
  refresh_token?: string | null
}

export interface IAccountProperties
  extends IAccountEssentialProperties,
    Required<IAccountOptionalProperties> {}

export interface IAccount {
  comparePassword(password: string): void
  compareRole(role: Role): void
  hashPassword(): void
  login(refresh_token: string): void
  logout(): void
  properties(): IAccountProperties
  update(nickname?: string, password?: string): void
}

export class Account implements IAccount {
  private id: number
  private email: string
  private password: string
  private nickname: string
  private role: Role = 'guest'
  private refresh_token = null
  private created_at: Date
  private updated_at: Date

  constructor(properties: IAccountEssentialProperties & IAccountOptionalProperties) {
    Object.assign(this, properties)
  }

  comparePassword(password: string) {
    if (!bcrypt.compareSync(password, this.password)) {
      throw new Http404Exception('로그인 실패')
    }
  }

  compareRole(role: Role) {
    if (role === 'admin' && this.role !== 'admin') {
      throw new Http403Exception('권한이 없습니다.')
    }
  }

  hashPassword() {
    if (!this.password) {
      throw new Http400Exception('잘못된 비밀번호 입니다.')
    }
    const salt = bcrypt.genSaltSync()
    const hashed_password = bcrypt.hashSync(this.password, salt)
    this.password = hashed_password
  }

  login(refresh_token: string) {
    this.refresh_token = refresh_token
  }

  logout() {
    this.refresh_token = null
  }

  update(nickname?: string, password?: string) {
    this.nickname = nickname ?? this.nickname

    if (password) {
      this.password = password
      this.hashPassword()
    }
  }

  properties() {
    return {
      id: this.id,
      email: this.email,
      nickname: this.nickname,
      password: this.password,
      role: this.role,
      refresh_token: this.refresh_token,
      created_at: this.created_at,
      updated_at: this.updated_at
    }
  }
}
