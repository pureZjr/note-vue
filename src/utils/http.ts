import axios, { AxiosResponse } from 'axios'
import qs from 'qs'
import { isNil } from 'lodash'

import _userInfoStore from '@/store/userInfo/index'
import { useRouter } from 'vue-router'

import config from '@/config/index'
import { ElMessage } from 'element-plus'
import { LOCALSTORAGE } from '@/constant/index'

type HttpMethods = 'GET' | 'POST'

const baseUrl = config.baseUrl

const userInfoStore = _userInfoStore()
const router = useRouter()

type Result<T> = {
  text?: string
  status: 'ok' | 'error'
  data?: T
  logout?: boolean
}

export default class Http {
  get: <T = null>(
    url: string,
    data: Record<string, any>,
    noErrTips?: boolean
  ) => Promise<T> = (
    url: string,
    data: Record<string, any>,
    noErrTips?: boolean
  ) => {
    return this.HandleHttp('GET', url, data, noErrTips)
  }

  post: <T = null>(url: string, data: any, noErrTips?: boolean) => Promise<T> =
    (url: string, data: any, noErrTips?: boolean) => {
      return this.HandleHttp('POST', url, data, noErrTips)
    }

  public HandleHttp<T = null>(
    method: HttpMethods,
    u: string,
    data: Record<string, any>,
    noErrTips?: boolean
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      let url = baseUrl + u
      const reqData = { ...data }
      if (method === 'GET') {
        url = `${baseUrl}${u}?${qs.stringify(reqData)}`
      }
      try {
        const userInfo = localStorage.getItem(LOCALSTORAGE.USERINFO)

        const headers = {}
        if (!!userInfo) {
          const { token } = JSON.parse(userInfo)
          Object.assign(headers, {
            token: token,
          })
        }

        const res: AxiosResponse<Result<T>> = await axios.request({
          headers,
          url,
          method,
          data: reqData,
        })

        switch (res.status) {
          case 200:
            if (res.data.status === 'ok' && !res.data.logout) {
              ;(resolve as (data: T | string | undefined) => void)(
                isNil(res.data.data) ? res.data.text : res.data.data
              )
            } else if (res.data.status === 'error') {
              if (!noErrTips) {
                ElMessage.error(res.data.text)
              }
              reject()
            } else {
              reject()
              if (!noErrTips) {
                ElMessage.error(res.data.text)
              }
            }
            if (res.data.logout) {
              localStorage.removeItem(LOCALSTORAGE.USERINFO)
              userInfoStore.setUserInfo({})
              if (!noErrTips) {
                return router.push('/login')
              }
            }
            break
          default:
            reject()
            if (!noErrTips) {
              ElMessage.error(res.data.text)
            }
        }
      } catch (err) {
        ElMessage.error('网络错误')
        reject(new Error('请求出错'))
      }
    })
  }
}
