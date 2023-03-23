import { defineStore } from 'pinia'

export default defineStore('userInfo', {
  state: () => {
    return {
      userInfo: {},
      userInfoVisible: false,
    }
  },
  getters: {},
  actions: {
    setUserInfoVisible(boo: boolean) {
      this.userInfoVisible = boo
    },
    setUserInfo(info: UserInfoStore.UserInfo) {
      this.userInfo = info
    },
  },
})
