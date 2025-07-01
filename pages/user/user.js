// pages/user/user.js
const app = getApp()
const util = require('../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userInfo: {
      nickName: '研学小探索',
      avatarUrl: 'https://img.icons8.com/color/96/user.png',
      level: 'VIP 1',
      progress: 65,
      nextLevelPoints: 350
    },
    
    // 用户统计
    userStats: {
      totalOrders: 12,
      favorites: 8,
      points: 2580,
      coupons: 3
    },
    
    // 订单数量统计
    orderCounts: {
      pending: 1,
      confirmed: 2,
      completed: 8,
      refund: 0
    },
    
    // 购物车数量
    cartCount: 0,
    
    // 最近活动
    recentActivities: [
      {
        id: 1,
        title: '故宫博物院研学营',
        image: 'https://picsum.photos/120/80?random=61',
        date: '2024-01-15',
        status: 'completed',
        statusText: '已完成'
      },
      {
        id: 2,
        title: '科技馆探索之旅',
        image: 'https://picsum.photos/120/80?random=62',
        date: '2024-01-08',
        status: 'confirmed',
        statusText: '已确认'
      },
      {
        id: 3,
        title: '自然生态研学营',
        image: 'https://picsum.photos/120/80?random=63',
        date: '2024-01-05',
        status: 'completed',
        statusText: '已完成'
      },
      {
        id: 4,
        title: '航空航天科普营',
        image: 'https://picsum.photos/120/80?random=64',
        date: '2024-02-20',
        status: 'pending',
        statusText: '待参加'
      }
    ],
    
    // 登录弹窗
    showLoginModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadUserInfo()
    this.updateCartCount()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadUserInfo()
    this.updateCartCount()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadUserInfo().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 加载用户信息
   */
  async loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.setData({ userInfo })
        // 这里可以调用API获取最新的用户数据
        // const userData = await request.get('/api/user/profile')
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  },

  /**
   * 更新购物车数量
   */
  updateCartCount() {
    const cart = wx.getStorageSync('cart') || []
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
    this.setData({ cartCount })
  },

  /**
   * 选择头像
   */
  async chooseAvatar() {
    if (!util.checkLogin()) {
      this.handleLogin()
      return
    }
    
    try {
      const tempFilePath = await util.getImageTempPath()
      this.setData({
        'userInfo.avatarUrl': tempFilePath
      })
      
      // 这里应该上传头像到服务器
      // const uploadResult = await request.upload('/api/upload/avatar', tempFilePath)
      
      util.showToast('头像更新成功')
    } catch (error) {
      console.error('选择头像失败:', error)
    }
  },

  /**
   * 处理登录
   */
  handleLogin() {
    this.setData({ showLoginModal: true })
  },

  /**
   * 隐藏登录弹窗
   */
  hideLoginModal() {
    this.setData({ showLoginModal: false })
  },

  /**
   * 微信授权登录
   */
  onGetUserProfile(e) {
    if (e.detail.userInfo) {
      const userInfo = e.detail.userInfo
      this.setData({ 
        userInfo,
        showLoginModal: false
      })
      
      // 保存用户信息到本地
      wx.setStorageSync('userInfo', userInfo)
      wx.setStorageSync('token', 'mock-token-' + Date.now())
      
      util.showToast('登录成功')
      
      // 这里应该调用登录API
      // const loginResult = await request.post('/api/auth/login', { userInfo })
    }
  },

  /**
   * 退出登录
   */
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('token')
          
          this.setData({
            userInfo: {
              nickName: '',
              avatarUrl: '',
              level: 'VIP 0',
              progress: 0,
              nextLevelPoints: 0
            }
          })
          
          util.showToast('已退出登录')
        }
      }
    })
  },

  /**
   * 跳转到订单页面
   */
  goToOrders(e) {
    const status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: `/pages/orders/orders${status ? '?status=' + status : ''}`
    })
  },

  /**
   * 查看所有订单
   */
  goToAllOrders() {
    wx.navigateTo({
      url: '/pages/orders/orders'
    })
  },

  /**
   * 跳转到收藏页面
   */
  goToFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    })
  },

  /**
   * 跳转到积分页面
   */
  goToPoints() {
    wx.navigateTo({
      url: '/pages/points/points'
    })
  },

  /**
   * 跳转到优惠券页面
   */
  goToCoupons() {
    wx.navigateTo({
      url: '/pages/coupons/coupons'
    })
  },

  /**
   * 跳转到购物车
   */
  goToCart() {
    wx.navigateTo({
      url: '/pages/cart/cart'
    })
  },

  /**
   * 跳转到地址管理
   */
  goToAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },

  /**
   * 邀请好友
   */
  goToInvite() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  /**
   * 联系客服
   */
  contactService() {
    wx.makePhoneCall({
      phoneNumber: '400-123-4567'
    })
  },

  /**
   * 意见反馈
   */
  goToFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    })
  },

  /**
   * 关于我们
   */
  goToAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  /**
   * 跳转到活动详情
   */
  goToActivityDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/study-detail/study-detail?id=${id}`
    })
  },

  /**
   * 显示协议
   */
  showAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '这里是用户协议的详细内容...',
      showCancel: false
    })
  },

  /**
   * 显示隐私政策
   */
  showPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '这里是隐私政策的详细内容...',
      showCancel: false
    })
  },

  /**
   * 阻止冒泡
   */
  stopPropagation() {
    // 空函数，阻止事件冒泡
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    return {
      title: '研学之旅 - 让学习成为一场精彩的旅程',
      path: '/pages/index/index',
      imageUrl: 'https://img.icons8.com/color/120/study.png'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '研学之旅 - 让学习成为一场精彩的旅程',
      imageUrl: 'https://img.icons8.com/color/120/study.png'
    }
  }
}) 