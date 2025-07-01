/**
 * 格式化时间
 */
const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

/**
 * 格式化日期
 */
const formatDate = (date, separator = '-') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join(separator)
}

/**
 * 数字前面补零
 */
const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 防抖函数
 */
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 */
const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 深拷贝
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const cloned = {}
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key])
    })
    return cloned
  }
}

/**
 * 手机号验证
 */
const validatePhone = (phone) => {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 身份证验证
 */
const validateIdCard = (idCard) => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(idCard)
}

/**
 * 邮箱验证
 */
const validateEmail = (email) => {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return reg.test(email)
}

/**
 * 价格格式化
 */
const formatPrice = (price) => {
  return parseFloat(price).toFixed(2)
}

/**
 * 数字千分位格式化
 */
const formatNumber2 = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 获取图片临时路径
 */
const getImageTempPath = () => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        resolve(res.tempFilePaths[0])
      },
      fail: reject
    })
  })
}

/**
 * 保存图片到相册
 */
const saveImageToPhotosAlbum = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取系统信息
 */
const getSystemInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 显示加载提示
 */
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
const hideLoading = () => {
  wx.hideLoading()
}

/**
 * 显示消息提示
 */
const showToast = (title, icon = 'success', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration
  })
}

/**
 * 显示确认对话框
 */
const showModal = (title, content) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        if (res.confirm) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail: reject
    })
  })
}

/**
 * 获取当前页面路径
 */
const getCurrentPagePath = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage.route
}

/**
 * 获取页面参数
 */
const getCurrentPageOptions = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage.options
}

/**
 * 跳转到登录页
 */
const redirectToLogin = () => {
  const currentPath = getCurrentPagePath()
  const currentOptions = getCurrentPageOptions()
  let redirectUrl = `/${currentPath}`
  
  if (Object.keys(currentOptions).length > 0) {
    const queryString = Object.keys(currentOptions)
      .map(key => `${key}=${currentOptions[key]}`)
      .join('&')
    redirectUrl += `?${queryString}`
  }

  wx.navigateTo({
    url: `/pages/login/login?redirect=${encodeURIComponent(redirectUrl)}`
  })
}

/**
 * 检查是否已登录
 */
const checkLogin = () => {
  const token = wx.getStorageSync('token')
  const userInfo = wx.getStorageSync('userInfo')
  return !!(token && userInfo)
}

/**
 * 设置导航栏标题
 */
const setNavigationBarTitle = (title) => {
  wx.setNavigationBarTitle({
    title
  })
}

/**
 * 预览图片
 */
const previewImage = (current, urls) => {
  wx.previewImage({
    current,
    urls
  })
}

/**
 * 拨打电话
 */
const makePhoneCall = (phoneNumber) => {
  wx.makePhoneCall({
    phoneNumber
  })
}

/**
 * 复制到剪贴板
 */
const setClipboardData = (data) => {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({
      data,
      success: () => {
        showToast('复制成功')
        resolve()
      },
      fail: reject
    })
  })
}

/**
 * 分享给朋友
 */
const shareToFriend = (title, path, imageUrl) => {
  return {
    title,
    path,
    imageUrl
  }
}

/**
 * 分享到朋友圈
 */
const shareToTimeline = (title, imageUrl) => {
  return {
    title,
    imageUrl
  }
}

/**
 * 距离计算
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const radLat1 = lat1 * Math.PI / 180.0
  const radLat2 = lat2 * Math.PI / 180.0
  const a = radLat1 - radLat2
  const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * 6378.137
  s = Math.round(s * 10000) / 10000
  return s
}

/**
 * 格式化距离显示
 */
const formatDistance = (distance) => {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)}m`
  } else {
    return `${distance.toFixed(1)}km`
  }
}

/**
 * 获取星期几
 */
const getWeekDay = (date) => {
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  return `星期${weekDays[date.getDay()]}`
}

/**
 * 计算年龄
 */
const calculateAge = (birthday) => {
  const today = new Date()
  const birthDate = new Date(birthday)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

module.exports = {
  formatTime,
  formatDate,
  formatNumber,
  debounce,
  throttle,
  deepClone,
  validatePhone,
  validateIdCard,
  validateEmail,
  formatPrice,
  formatNumber2,
  getImageTempPath,
  saveImageToPhotosAlbum,
  getSystemInfo,
  showLoading,
  hideLoading,
  showToast,
  showModal,
  getCurrentPagePath,
  getCurrentPageOptions,
  redirectToLogin,
  checkLogin,
  setNavigationBarTitle,
  previewImage,
  makePhoneCall,
  setClipboardData,
  shareToFriend,
  shareToTimeline,
  calculateDistance,
  formatDistance,
  getWeekDay,
  calculateAge
} 