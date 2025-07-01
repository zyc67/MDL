// pages/items/items.js
const request = require('../../utils/request')
const util = require('../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 搜索相关
    searchValue: '',
    showFilter: false,
    
    // 筛选条件
    currentCategory: 'all',
    priceRange: '',
    sortType: 'default',
    
    // 分类数据
    categoryList: [
      {
        id: 'all',
        name: '全部',
        icon: 'https://img.icons8.com/color/60/home.png'
      },
      {
        id: 'bag',
        name: '背包',
        icon: 'https://img.icons8.com/color/60/backpack.png'
      },
      {
        id: 'clothes',
        name: '服装',
        icon: 'https://img.icons8.com/color/60/t-shirt.png'
      },
      {
        id: 'tool',
        name: '工具',
        icon: 'https://img.icons8.com/color/60/toolbox.png'
      },
      {
        id: 'book',
        name: '书籍',
        icon: 'https://img.icons8.com/color/60/book.png'
      },
      {
        id: 'souvenir',
        name: '纪念品',
        icon: 'https://img.icons8.com/color/60/gift.png'
      }
    ],
    
    // 物品列表
    itemList: [],
    
    // 分页参数
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    
    // 购物车数量
    cartCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 立即设置一些基础数据，让页面不空白
    this.setData({
      itemList: this.getMockItemList().slice(0, 6) // 先显示6个
    })
    // 然后加载完整数据
    this.loadItemList()
    this.updateCartCount()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.updateCartCount()
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.setData({
      page: 1,
      itemList: [],
      hasMore: true
    })
    this.loadItemList().then(() => {
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
   * 加载物品列表
   */
  async loadItemList() {
    this.setData({ loading: true })
    
    try {
      // 模拟API请求
      const mockData = this.getMockItemList()
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 150))
      
      const { page, pageSize } = this.data
      const newList = page === 1 ? mockData : [...this.data.itemList, ...mockData]
      
      this.setData({
        itemList: newList,
        hasMore: mockData.length === pageSize,
        loading: false
      })
    } catch (error) {
      console.error('加载物品列表失败:', error)
      util.showToast('加载失败，请重试', 'none')
      this.setData({ loading: false })
    }
  },

  /**
   * 获取模拟数据
   */
  getMockItemList() {
    return [
      {
        id: 1,
        title: '户外防水双肩包',
        description: '大容量防水背包，适合研学旅行',
        image: 'https://picsum.photos/400/400?random=21',
        price: 128,
        originalPrice: 168,
        discount: 8,
        tag: '热销',
        sales: 1280,
        rating: 4.8,
        reviewCount: 156,
        category: 'bag'
      },
      {
        id: 2,
        title: '研学笔记本套装',
        description: '精美笔记本+笔，记录研学点滴',
        image: 'https://picsum.photos/400/400?random=22',
        price: 58,
        sales: 856,
        rating: 4.7,
        reviewCount: 94,
        category: 'tool'
      },
      {
        id: 3,
        title: '户外速干T恤',
        description: '透气速干，舒适耐穿',
        image: 'https://picsum.photos/400/400?random=23',
        price: 89,
        originalPrice: 129,
        discount: 7,
        tag: '新品',
        sales: 642,
        rating: 4.6,
        reviewCount: 78,
        category: 'clothes'
      },
      {
        id: 4,
        title: '便携式放大镜',
        description: '高清光学放大镜，观察细节好帮手',
        image: 'https://picsum.photos/400/400?random=24',
        price: 45,
        sales: 421,
        rating: 4.9,
        reviewCount: 67,
        category: 'tool'
      },
      {
        id: 5,
        title: '中国历史知识手册',
        description: '图文并茂，研学必备工具书',
        image: 'https://picsum.photos/400/400?random=25',
        price: 32,
        sales: 1156,
        rating: 4.8,
        reviewCount: 234,
        category: 'book'
      },
      {
        id: 6,
        title: '户外多功能帽子',
        description: '防晒遮阳，透气舒适',
        image: 'https://picsum.photos/400/400?random=26',
        price: 65,
        originalPrice: 85,
        discount: 8,
        tag: '特价',
        sales: 523,
        rating: 4.5,
        reviewCount: 89,
        category: 'clothes'
      },
      {
        id: 7,
        title: '便携式急救包',
        description: '户外必备，安全保障',
        image: 'https://picsum.photos/400/400?random=27',
        price: 78,
        sales: 345,
        rating: 4.7,
        reviewCount: 56,
        category: 'tool'
      },
      {
        id: 8,
        title: '博物馆纪念邮票',
        description: '精美收藏，纪念意义',
        image: 'https://picsum.photos/400/400?random=28',
        price: 25,
        sales: 789,
        rating: 4.6,
        reviewCount: 134,
        category: 'souvenir'
      },
      {
        id: 9,
        title: '儿童科学实验套装',
        description: '启发思维，动手探索',
        image: 'https://picsum.photos/400/400?random=29',
        price: 156,
        originalPrice: 198,
        discount: 8,
        tag: '推荐',
        sales: 678,
        rating: 4.9,
        reviewCount: 123,
        category: 'tool'
      },
      {
        id: 10,
        title: '古诗词朗读本',
        description: '经典诵读，文化传承',
        image: 'https://picsum.photos/400/400?random=30',
        price: 42,
        sales: 912,
        rating: 4.8,
        reviewCount: 187,
        category: 'book'
      }
    ]
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
   * 搜索输入事件
   */
  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
    
    // 实时搜索（加防抖）
    clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(() => {
      this.searchItems(e.detail.value)
    }, 500)
  },

  /**
   * 搜索物品
   */
  searchItems(keyword) {
    if (!keyword.trim()) {
      this.loadItemList()
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
      itemList: []
    })
    this.loadItemList()
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
   * 选择排序方式
   */
  selectSort(e) {
    this.setData({
      sortType: e.currentTarget.dataset.sort
    })
  },

  /**
   * 重置筛选条件
   */
  resetFilter() {
    this.setData({
      priceRange: '',
      sortType: 'default'
    })
  },

  /**
   * 确认筛选
   */
  confirmFilter() {
    this.setData({
      showFilter: false,
      page: 1,
      itemList: []
    })
    this.loadItemList()
    
    util.showToast('筛选已应用')
  },

  /**
   * 加载更多
   */
  loadMore() {
    this.setData({
      page: this.data.page + 1
    })
    this.loadItemList()
  },

  /**
   * 跳转到物品详情
   */
  goToDetail(e) {
    const itemId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/item-detail/item-detail?id=${itemId}`
    })
  },

  /**
   * 快速购买
   */
  quickBuy(e) {
    const itemId = e.currentTarget.dataset.id
    const item = this.data.itemList.find(item => item.id === itemId)
    
    if (!item) return
    
    // 直接加入购物车
    let cart = wx.getStorageSync('cart') || []
    const existIndex = cart.findIndex(cartItem => cartItem.id === item.id && cartItem.type === 'item')
    
    if (existIndex > -1) {
      cart[existIndex].quantity += 1
    } else {
      cart.push({
        id: item.id,
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: 1,
        type: 'item'
      })
    }
    
    wx.setStorageSync('cart', cart)
    this.updateCartCount()
    util.showToast('已加入购物车')
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
   * 跳转到首页
   */
  goToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /**
   * 页面分享
   */
  onShareAppMessage() {
    return {
      title: '研学物品商城 - 精选优质研学用品',
      path: '/pages/items/items',
      imageUrl: '/images/share-items.jpg'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '研学物品商城 - 精选优质研学用品',
      imageUrl: '/images/share-items.jpg'
    }
  }
}) 