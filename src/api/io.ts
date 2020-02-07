import Taro from '@tarojs/taro'

const token = 'true' // 规避接口鉴权
const BaseConfig = {
  api: 'https://ruraltech.cn/Api'
}

interface OptionPerson {
  isShowLoading: boolean
  loadingText: string
  url: string
  data: object
  // method: string  | undefined,
  method: 'GET' | 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | undefined
  header: object
  success?: any
  fail?: any
}

// let LoadingToast: any = null

const codeMessage: Object = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  412: '访问被拒绝,请重新登录',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

// 检测请求状态
const checkStatusAndFilter = (response): Promise<any> | undefined => {
  Taro.hideLoading()
  if (response.statusCode >= 200 && response.statusCode < 300) {
    if (response.statusCode === 200 || response.statusCode === 304) {
      return response.data
    }
    return response
  }

  const errortext = codeMessage[response.statusCode] || response.errMsg
  Taro.showToast({
    title: errortext,
    mask: true,
    icon: 'none',
    duration: 2000
  })
  return Promise.reject(response)
}

export const baseOptions = async (params, method) => {
  try {
    let { url, data, isShowLoading, loadingText } = params
    let contentType = 'application/x-www-form-urlencoded'
    contentType = params.contentType || contentType
    const option: OptionPerson = {
      isShowLoading: isShowLoading || false,
      loadingText: loadingText || 'loading',
      url: `${BaseConfig.api}${url}`,
      data,
      method,
      header: { 'content-type': contentType, Token: token }
    }
    // .abort() // 取消请求任务
    console.log(isShowLoading)
    
    isShowLoading &&
      Taro.showLoading({
        title: option.loadingText,
        mask: true
      })

    return await Taro.request(option)
      .then(checkStatusAndFilter)
      .then(res => {
        // 这一块是我和后端协商的,接口内部为1则出错的,为0才有数据回来
        if (res.code === 0) {
          const errMsg = res.message ? res.message : '接口错误'
          Taro.showToast({
            title: errMsg,
            mask: true,
            icon: 'none',
            duration: 2000
          })
          Promise.reject(errMsg)
        }
        if (res.code === 1) {
          return res
        }
        return res
      })
      .catch(errRes => {
        Taro.hideLoading()
        // if (errRes.statusCode === 412) { // 未登录
        //   Taro.reLaunch({ url: '/pages/login/index' })
        // }
        console.log('api error', errRes)
      })
  } catch (err) {
    Taro.showToast({
      title: '代码执行异常',
      mask: true,
      icon: 'none',
      duration: 2000
    })
  }
}

export default options => {
  let { url, data, method, isShowLoading } = options
  if (method === 'POST' || method === 'post') {
    return baseOptions({ url, data, method, isShowLoading }, 'POST')
  } else {
    return baseOptions({ url, data, method, isShowLoading }, 'GET')
  }
}
