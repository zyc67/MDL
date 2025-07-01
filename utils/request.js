const app = getApp()

/**
 * 网络请求封装
 */
class Request {
  constructor() {
    this.baseURL = app.globalData.baseUrl || 'https://api.example.com'
    this.timeout = 10000
    this.interceptors = {
      request: [],
      response: []
    }
  }

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor)
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor)
  }

  /**
   * 处理请求拦截器
   */
  handleRequestInterceptors(config) {
    this.interceptors.request.forEach(interceptor => {
      config = interceptor(config)
    })
    return config
  }

  /**
   * 处理响应拦截器
   */
  handleResponseInterceptors(response) {
    this.interceptors.response.forEach(interceptor => {
      response = interceptor(response)
    })
    return response
  }

  /**
   * 发起请求
   */
  request(options) {
    return new Promise((resolve, reject) => {
      // 默认配置
      let config = {
        url: this.baseURL + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          ...options.header
        },
        timeout: options.timeout || this.timeout
      }

      // 添加token
      const token = wx.getStorageSync('token')
      if (token) {
        config.header.Authorization = `Bearer ${token}`
      }

      // 处理请求拦截器
      config = this.handleRequestInterceptors(config)

      // 发起请求
      wx.request({
        ...config,
        success: (res) => {
          try {
            // 处理响应拦截器
            const response = this.handleResponseInterceptors(res)
            
            // 检查业务状态码
            if (response.data.code === 200) {
              resolve(response.data)
            } else if (response.data.code === 401) {
              // token过期，清除本地存储并跳转登录
              wx.removeStorageSync('token')
              wx.removeStorageSync('userInfo')
              wx.showToast({
                title: '登录已过期，请重新登录',
                icon: 'none'
              })
              // 可以在这里跳转到登录页
              reject(new Error('登录已过期'))
            } else {
              wx.showToast({
                title: response.data.message || '请求失败',
                icon: 'none'
              })
              reject(new Error(response.data.message || '请求失败'))
            }
          } catch (error) {
            reject(error)
          }
        },
        fail: (error) => {
          console.error('请求失败:', error)
          wx.showToast({
            title: '网络连接失败',
            icon: 'none'
          })
          reject(error)
        }
      })
    })
  }

  /**
   * GET请求
   */
  get(url, params = {}, options = {}) {
    // 将参数拼接到URL中
    if (Object.keys(params).length > 0) {
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&')
      url += (url.includes('?') ? '&' : '?') + queryString
    }

    return this.request({
      url,
      method: 'GET',
      ...options
    })
  }

  /**
   * POST请求
   */
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  /**
   * PUT请求
   */
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  /**
   * DELETE请求
   */
  delete(url, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      ...options
    })
  }

  /**
   * 文件上传
   */
  upload(url, filePath, name = 'file', formData = {}) {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token')
      const header = {}
      if (token) {
        header.Authorization = `Bearer ${token}`
      }

      wx.uploadFile({
        url: this.baseURL + url,
        filePath,
        name,
        formData,
        header,
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            if (data.code === 200) {
              resolve(data)
            } else {
              wx.showToast({
                title: data.message || '上传失败',
                icon: 'none'
              })
              reject(new Error(data.message || '上传失败'))
            }
          } catch (error) {
            reject(error)
          }
        },
        fail: (error) => {
          console.error('上传失败:', error)
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          })
          reject(error)
        }
      })
    })
  }
}

// 创建实例
const request = new Request()

// 添加请求拦截器
request.addRequestInterceptor((config) => {
  console.log('请求配置:', config)
  return config
})

// 添加响应拦截器
request.addResponseInterceptor((response) => {
  console.log('响应数据:', response)
  return response
})

module.exports = request 