const request = require('../../utils/request')
const util = require('../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    studyId: null,
    loading: true,
    isFavorite: false,
    
    // 研学详情数据
    studyDetail: {
      id: 1,
      title: '故宫博物院深度研学营',
      price: 880,
      tag: '热门',
      location: '北京',
      duration: 2,
      rating: 4.8,
      reviewCount: 256,
      participants: 1280,
      images: [
        'https://picsum.photos/750/500?random=31',
        'https://picsum.photos/750/500?random=32',
        'https://picsum.photos/750/500?random=33'
      ],
      highlights: [
        '专业导师全程讲解，深度了解明清皇家文化',
        '独家开放区域参观，体验皇家生活场景',
        '手工制作传统工艺品，寓教于乐',
        '小班制教学，保证学习质量',
        '包含午餐和交通，省心省力'
      ],
      description: '走进紫禁城，探寻明清皇家文化。本次研学营将带领学员深入故宫博物院，通过专业导师的讲解，了解中国古代建筑艺术、皇家礼仪文化、文物保护知识等内容。活动采用互动式教学，让学员在游览中学习，在体验中成长。',
      schedule: [
        {
          day: 1,
          title: '故宫建筑艺术探索',
          description: '参观太和殿、中和殿、保和殿，了解中国古代建筑特点和皇家建筑规制',
          time: '09:00-17:00'
        },
        {
          day: 2,
          title: '文物鉴赏与手工制作',
          description: '参观珍宝馆和钟表馆，学习文物鉴赏知识，体验传统手工艺制作',
          time: '09:00-16:00'
        }
      ],
      priceInclude: '门票费用、导师讲解费、午餐费、交通费、手工材料费、保险费',
      priceExclude: '个人消费、额外餐费、住宿费用',
      notices: [
        '请携带有效身份证件',
        '穿着舒适的鞋子，建议平底鞋',
        '请爱护文物，遵守参观规定',
        '如遇恶劣天气，活动可能会调整时间',
        '12岁以下儿童需家长陪同参加'
      ],
      reviews: [
        {
          id: 1,
          nickname: '家长小王',
          avatar: 'https://img.icons8.com/color/60/user.png',
          rating: 5,
          date: '2024-01-15',
          content: '非常棒的研学活动！孩子学到了很多历史知识，导师讲解得很生动有趣。',
          images: ['/images/review1.jpg']
        },
        {
          id: 2,
          nickname: '学霸妈妈',
          avatar: 'https://img.icons8.com/color/60/user-female.png',
          rating: 5,
          date: '2024-01-10',
          content: '组织得很好，时间安排合理，孩子玩得开心学得也开心。强烈推荐！'
        }
      ]
    },
    
    // 推荐活动
    recommendList: [
              {
          id: 2,
          title: '中科院科技探索',
          image: 'https://picsum.photos/250/160?random=41',
          price: 1200
        },
        {
          id: 3,
          title: '自然博物馆奇趣之旅',
          image: 'https://picsum.photos/250/160?random=42',
          price: 650
        },
        {
          id: 4,
          title: '国学文化体验营',
          image: 'https://picsum.photos/250/160?random=43',
          price: 780
        }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.setData({
        studyId: parseInt(options.id)
      })
      this.loadStudyDetail()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.checkFavoriteStatus()
  },

  /**
   * 加载研学详情
   */
  async loadStudyDetail() {
    try {
      this.setData({ loading: true })
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // 这里应该调用真实的API
      // const data = await request.get(`/api/studies/${this.data.studyId}`)
      
      this.setData({ loading: false })
    } catch (error) {
      console.error('加载研学详情失败:', error)
      this.setData({ loading: false })
      util.showToast('加载失败，请重试', 'none')
    }
  },

  /**
   * 检查收藏状态
   */
  checkFavoriteStatus() {
    const favorites = wx.getStorageSync('favorites') || []
    const isFavorite = favorites.includes(this.data.studyId)
    this.setData({ isFavorite })
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite() {
    if (!util.checkLogin()) {
      util.redirectToLogin()
      return
    }

    const { studyId, isFavorite } = this.data
    let favorites = wx.getStorageSync('favorites') || []
    
    if (isFavorite) {
      // 取消收藏
      favorites = favorites.filter(id => id !== studyId)
      util.showToast('已取消收藏')
    } else {
      // 添加收藏
      favorites.push(studyId)
      util.showToast('已添加收藏')
    }
    
    wx.setStorageSync('favorites', favorites)
    this.setData({ isFavorite: !isFavorite })
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
   * 分享活动
   */
  shareActivity() {
    const { studyDetail } = this.data
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  /**
   * 加入购物车
   */
  addToCart() {
    if (!util.checkLogin()) {
      util.redirectToLogin()
      return
    }

    const { studyDetail } = this.data
    let cart = wx.getStorageSync('cart') || []
    
    // 检查是否已存在
    const existIndex = cart.findIndex(item => item.id === studyDetail.id)
    if (existIndex > -1) {
      cart[existIndex].quantity += 1
    } else {
      cart.push({
        id: studyDetail.id,
        title: studyDetail.title,
        image: studyDetail.images[0],
        price: studyDetail.price,
        quantity: 1,
        type: 'study'
      })
    }
    
    wx.setStorageSync('cart', cart)
    util.showToast('已加入购物车')
  },

  /**
   * 立即报名
   */
  buyNow() {
    if (!util.checkLogin()) {
      util.redirectToLogin()
      return
    }

    const { studyDetail } = this.data
    const orderInfo = {
      id: studyDetail.id,
      title: studyDetail.title,
      image: studyDetail.images[0],
      price: studyDetail.price,
      quantity: 1,
      location: studyDetail.location,
      duration: studyDetail.duration,
      type: 'study'
    }
    
    wx.navigateTo({
      url: `/pages/payment/payment?orderInfo=${encodeURIComponent(JSON.stringify(orderInfo))}`
    })
  },

  /**
   * 查看所有评价
   */
  viewAllReviews() {
    wx.navigateTo({
      url: `/pages/reviews/reviews?studyId=${this.data.studyId}`
    })
  },

  /**
   * 跳转到推荐活动
   */
  goToRecommend(e) {
    const id = e.currentTarget.dataset.id
    wx.redirectTo({
      url: `/pages/study-detail/study-detail?id=${id}`
    })
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    const { studyDetail } = this.data
    return {
      title: studyDetail.title,
      path: `/pages/study-detail/study-detail?id=${studyDetail.id}`,
      imageUrl: studyDetail.images[0]
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    const { studyDetail } = this.data
    return {
      title: `${studyDetail.title} - 研学之旅`,
      imageUrl: studyDetail.images[0]
    }
  }
}) 