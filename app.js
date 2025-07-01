// app.js
App({
  /**
   * 小程序启动时的初始化
   */
  onLaunch() {
    // 检查小程序更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('检查更新结果:', res.hasUpdate)
      })
    }

    // 获取用户信息
    this.getUserInfo()
  },

  /**
   * 小程序显示时触发
   */
  onShow() {
    console.log('小程序显示')
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          this.globalData.userInfo = res.userInfo
          resolve(res.userInfo)
        },
        fail: reject
      })
    })
  },

  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    baseUrl: 'https://api.example.com', // API基础地址
    version: '1.0.0'
  }
}) 