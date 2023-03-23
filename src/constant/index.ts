const isDev = import.meta.env.DEV
export const SHARE_BASE_URL = isDev
  ? `http://localhost:7001/#/share-article/`
  : `https://note.renjianzahuopu.store/#/share-article/`

// 上传资源大小
export const IMAGE_SIZE_LIMIT = 20 * 1024 * 1024
export const FILE_SIZE_LIMIT = 5 * 1024 * 1024
// 七牛相关
export const QN_UPLOAD_URL = 'https://upload-z2.qiniup.com'
export const QN_BUCKET = 'renjianzahuopu-src'
export const QN_SOURCE_URL = 'http://src.renjianzahuopu.store'

export const LOCALSTORAGE = {
  USERINFO: 'userinfo',
  FILEANDFOLDERDISPLAY: 'fileandfolderdisplay',
  FILEANDFOLDERSORT: 'fileandfoldersort',
}

// 错误图片
export const BREAK_IMAGE = `${QN_SOURCE_URL}/note/break-img.jpg%2188con`
