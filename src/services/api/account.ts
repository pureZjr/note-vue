import Http from '@/utils/http'

const { post } = new Http()

// 登录
export const login = (data: any) => {
  return post<UserInfoStore.UserInfo>('account-login', data)
}

// 登出
export const logout = () => {
  return post('account-logout', {})
}

// 注册
export const register = (data: any) => {
  return post('account-register', data)
}

// 编辑
export const edit = (data: any) => {
  return post('account-edit', data)
}
