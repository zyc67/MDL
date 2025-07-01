const app = getApp()

Page({
  /**
   * 页面初始数据
   */
  data: {
    // 搜索相关
    searchValue: '',
    showFilter: false,
    
    // 筛选条件
    currentCategory: 'all',
    priceRange: '',
    duration: '',
    
    // 轮播图数据
    bannerList: [
      {
        id: 1,
        image: 'https://picsum.photos/750/400?random=1',
        title: '故宫博物院研学之旅',
        description: '探索千年文化，体验皇家历史'
      },
      {
        id: 2,
        image: 'https://picsum.photos/750/400?random=2',
        title: '科技馆奇妙探索',
        description: '科学启蒙，创新思维培养'
      },
      {
        id: 3,
        image: 'https://picsum.photos/750/400?random=3',
        title: '自然生态研学营',
        description: '亲近自然，了解生态平衡'
      }
    ],
    
    // 分类数据
    categoryList: [
      {
        id: 'all',
        name: '全部',
        icon: 'https://img.icons8.com/color/60/home.png'
      },
      {
        id: 'history',
        name: '历史文化',
        icon: 'https://img.icons8.com/color/60/museum.png'
      },
      {
        id: 'science',
        name: '科学探索',
        icon: 'https://img.icons8.com/color/60/test-tube.png'
      },
      {
        id: 'nature',
        name: '自然生态',
        icon: 'https://img.icons8.com/color/60/tree.png'
      },
      {
        id: 'art',
        name: '艺术体验',
        icon: 'https://img.icons8.com/color/60/paint-palette.png'
      },
      {
        id: 'sports',
        name: '体育健身',
        icon: 'https://img.icons8.com/color/60/sports.png'
      }
    ],
    
    // 研学活动列表
    studyList: [],
    
    // 分页参数
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false
  },

  /**
   * 页面加载时执行
   */
  onLoad(options) {
    // 立即设置一些基础数据，让页面不空白
    this.setData({
      studyList: this.getMockStudyList().slice(0, 3) // 先显示3个
    })
    // 然后加载完整数据
    this.loadStudyList()
  },

  /**
   * 页面显示时执行
   */
  onShow() {
    // 可以在这里刷新数据
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.setData({
      page: 1,
      studyList: [],
      hasMore: true
    })
    this.loadStudyList().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore()
    }
  },

  /**
   * 加载研学活动列表
   */
  async loadStudyList() {
    this.setData({ loading: true })
    
    try {
      // 模拟API请求
      const mockData = this.getMockStudyList()
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const { page, pageSize } = this.data
      const newList = page === 1 ? mockData : [...this.data.studyList, ...mockData]
      
      this.setData({
        studyList: newList,
        hasMore: mockData.length === pageSize,
        loading: false
      })
    } catch (error) {
      console.error('加载研学列表失败:', error)
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      })
      this.setData({ loading: false })
    }
  },

  /**
   * 获取模拟数据
   */
  getMockStudyList() {
    return [
      {
        id: 1,
        title: '故宫博物院深度研学营',
        image: 'https://picsum.photos/400/280?random=11',
        price: 880,
        tag: '热门',
        location: '北京',
        duration: 2,
        rating: 4.8,
        reviewCount: 256,
        participants: 1280,
        description: '走进紫禁城，探寻明清皇家文化，专业导师全程讲解历史背景...',
        category: 'history'
      },
      {
        id: 2,
        title: '中科院科技探索之旅',
        image: 'https://picsum.photos/400/280?random=12',
        price: 1200,
        tag: '推荐',
        location: '北京',
        duration: 3,
        rating: 4.9,
        reviewCount: 189,
        participants: 856,
        description: '前沿科技体验，激发科学兴趣，培养创新思维和动手能力...',
        category: 'science'
      },
      {
        id: 3,
        title: '大自然生态研学营',
        image: 'https://picsum.photos/400/280?random=13',
        price: 650,
        tag: '特价',
        location: '杭州',
        duration: 1,
        rating: 4.7,
        reviewCount: 94,
        participants: 425,
        description: '亲近大自然，了解生态系统，培养环保意识和自然观察能力...',
        category: 'nature'
      },
      {
        id: 4,
        title: '国学文化体验营',
        image: 'https://picsum.photos/400/280?random=14',
        price: 780,
        tag: '精品',
        location: '曲阜',
        duration: 2,
        rating: 4.6,
        reviewCount: 142,
        participants: 688,
        description: '学习传统文化，体验国学魅力，感受中华文明的博大精深...',
        category: 'history'
      },
      {
        id: 5,
        title: '航空航天科普营',
        image: 'https://picsum.photos/400/280?random=15',
        price: 1500,
        tag: '新品',
        location: '西昌',
        duration: 4,
        rating: 4.9,
        reviewCount: 78,
        participants: 234,
        description: '探索浩瀚宇宙，了解航天科技，培养航空航天兴趣...',
        category: 'science'
      },
      {
        id: 6,
        title: '海洋生物探索营',
        image: 'https://picsum.photos/400/280?random=16',
        price: 920,
        tag: '推荐',
        location: '青岛',
        duration: 3,
        rating: 4.7,
        reviewCount: 167,
        participants: 543,
        description: '深入海洋世界，了解海洋生物多样性，培养海洋保护意识...',
        category: 'nature'
      },
      {
        id: 7,
        title: '古建筑文化研学',
        image: 'https://picsum.photos/400/280?random=17',
        price: 680,
        tag: '文化',
        location: '西安',
        duration: 2,
        rating: 4.8,
        reviewCount: 203,
        participants: 789,
        description: '探访古都建筑，学习传统工艺，感受千年文化底蕴...',
        category: 'history'
      },
      {
        id: 8,
        title: '机器人编程体验营',
        image: 'https://picsum.photos/400/280?random=18',
        price: 1080,
        tag: '科技',
        location: '深圳',
        duration: 2,
        rating: 4.9,
        reviewCount: 124,
        participants: 456,
        description: '学习编程基础，体验人工智能，培养逻辑思维能力...',
        category: 'science'
      }
    ]
  },

  /**
   * 搜索输入事件
   */
  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
    
    // 实时搜索（可以加防抖）
    this.searchStudyList(e.detail.value)
  },

  /**
   * 搜索研学活动
   */
  searchStudyList(keyword) {
    if (!keyword.trim()) {
      this.loadStudyList()
      return
    }
    
    // 这里应该调用搜索API
    console.log('搜索关键词:', keyword)
  },

  /**
   * 分类切换
   */
  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({
      currentCategory: categoryId,
      page: 1,
      studyList: []
    })
    this.loadStudyList()
  },

  /**
   * 显示筛选弹窗
   */
  showFilterModal() {
    this.setData({ showFilter: true })
  },

  /**
   * 隐藏筛选弹窗
   */
  hideFilterModal() {
    this.setData({ showFilter: false })
  },

  /**
   * 阻止冒泡
   */
  stopPropagation() {
    // 空函数，阻止事件冒泡
  },

  /**
   * 选择价格区间
   */
  selectPriceRange(e) {
    this.setData({
      priceRange: e.currentTarget.dataset.range
    })
  },

  /**
   * 选择活动天数
   */
  selectDuration(e) {
    this.setData({
      duration: e.currentTarget.dataset.duration
    })
  },

  /**
   * 重置筛选条件
   */
  resetFilter() {
    this.setData({
      priceRange: '',
      duration: ''
    })
  },

  /**
   * 确认筛选
   */
  confirmFilter() {
    this.setData({
      showFilter: false,
      page: 1,
      studyList: []
    })
    this.loadStudyList()
    
    wx.showToast({
      title: '筛选已应用',
      icon: 'success'
    })
  },

  /**
   * 加载更多
   */
  loadMore() {
    this.setData({
      page: this.data.page + 1
    })
    this.loadStudyList()
  },

  /**
   * 跳转到研学详情页
   */
  goToDetail(e) {
    const studyId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/study-detail/study-detail?id=${studyId}`
    })
  },

  /**
   * 分享功能
   */
  onShareAppMessage() {
    return {
      title: '研学之旅 - 发现更精彩的学习体验',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '研学之旅 - 发现更精彩的学习体验',
      imageUrl: '/images/share-cover.jpg'
    }
  }
}) 