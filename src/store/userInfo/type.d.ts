export as namespace UserInfoStore

export interface LoginInfo {
  email: string
  password: string
}

export interface UserInfo {
  avatar?: string
  email?: string
  username?: string
  sex?: 0 | 1
  area?: string
  sign?: string
  token?: string
  lastLoginTime?: number
}
