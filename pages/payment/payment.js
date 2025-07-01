// pages/payment/payment.js
const request = require('../../utils/request')
const util = require('../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 订单信息
    orderInfo: {
      id: 1,
      title: '故宫博物院深度研学营',
      image: 'https://picsum.photos/400/280?random=51',
      price: 880,
      quantity: 1,
      date: '2024-02-15',
      location: '北京市东城区'
    },
    
    // 参与人信息
    participants: [
      {
        id: 1,
        name: '张小明',
        idCard: '110101199001011234',
        phone: '13812345678',
        type: '成人'
      }
    ],
    
    // 联系人信息
    contactInfo: {
      name: '张女士',
      phone: '13812345678'
    },
    
    // 优惠券
    selectedCoupon: null,
    availableCoupons: [
      {
        id: 1,
        name: '新用户专享券',
        discount: 50,
        condition: '满300可用',
        expireDate: '2024-03-31'
      },
      {
        id: 2,
        name: '研学体验券',
        discount: 100,
        condition: '满800可用',
        expireDate: '2024-04-15'
      }
    ],
    
    // 费用明细
    costDetail: {
      activityFee: 880,
      serviceFee: 20,
      insuranceFee: 10,
      discount: 0,
      totalAmount: 910
    },
    
    // 支付方式
    selectedPayMethod: 'wechat',
    
    // 协议
    agreedToTerms: false,
    
    // 状态
    loading: false,
    paying: false,
    
    // 弹窗状态
    showParticipantModal: false,
    showCouponModal: false,
    selectedCouponId: null,
    
    // 编辑参与人
    editingParticipant: {},
    participantTypes: ['成人', '儿童', '学生', '老人'],
    
    // 支付说明
    paymentNote: '支付成功后将发送确认短信'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.orderInfo) {
      try {
        const orderInfo = JSON.parse(decodeURIComponent(options.orderInfo))
        this.setData({ orderInfo })
        this.calculateTotal()
      } catch (error) {
        console.error('解析订单信息失败:', error)
      }
    }
  },

  /**
   * 计算总金额
   */
  calculateTotal() {
    const { costDetail, selectedCoupon } = this.data
    const discount = selectedCoupon ? selectedCoupon.discount : 0
    const totalAmount = costDetail.activityFee + costDetail.serviceFee + costDetail.insuranceFee - discount
    
    this.setData({
      'costDetail.discount': discount,
      'costDetail.totalAmount': Math.max(totalAmount, 0)
    })
  },

  /**
   * 选择支付方式
   */
  selectPayMethod(e) {
    this.setData({
      selectedPayMethod: e.currentTarget.dataset.method
    })
  },

  /**
   * 切换协议同意状态
   */
  toggleAgreement() {
    this.setData({
      agreedToTerms: !this.data.agreedToTerms
    })
  },

  /**
   * 显示优惠券弹窗
   */
  selectCoupon() {
    this.setData({ 
      showCouponModal: true,
      selectedCouponId: this.data.selectedCoupon ? this.data.selectedCoupon.id : null
    })
  },

  /**
   * 隐藏优惠券弹窗
   */
  hideCouponModal() {
    this.setData({ showCouponModal: false })
  },

  /**
   * 选择优惠券
   */
  chooseCoupon(e) {
    const couponId = e.currentTarget.dataset.id
    this.setData({ selectedCouponId: couponId })
  },

  /**
   * 确认优惠券选择
   */
  confirmCoupon() {
    const { selectedCouponId, availableCoupons } = this.data
    const selectedCoupon = selectedCouponId ? availableCoupons.find(c => c.id === selectedCouponId) : null
    
    this.setData({
      selectedCoupon,
      showCouponModal: false
    })
    
    this.calculateTotal()
    util.showToast(selectedCoupon ? '优惠券已选择' : '已取消优惠券')
  },

  /**
   * 编辑参与人
   */
  editParticipants() {
    this.setData({
      showParticipantModal: true,
      editingParticipant: this.data.participants[0] || {}
    })
  },

  /**
   * 隐藏参与人弹窗
   */
  hideParticipantModal() {
    this.setData({ showParticipantModal: false })
  },

  /**
   * 参与人姓名输入
   */
  onParticipantNameInput(e) {
    this.setData({
      'editingParticipant.name': e.detail.value
    })
  },

  /**
   * 参与人身份证输入
   */
  onParticipantIdInput(e) {
    this.setData({
      'editingParticipant.idCard': e.detail.value
    })
  },

  /**
   * 参与人手机号输入
   */
  onParticipantPhoneInput(e) {
    this.setData({
      'editingParticipant.phone': e.detail.value
    })
  },

  /**
   * 参与人类型选择
   */
  onParticipantTypeChange(e) {
    const index = e.detail.value
    this.setData({
      'editingParticipant.typeIndex': index,
      'editingParticipant.type': this.data.participantTypes[index]
    })
  },

  /**
   * 保存参与人
   */
  saveParticipant() {
    const { editingParticipant } = this.data
    
    if (!editingParticipant.name || !editingParticipant.idCard || !editingParticipant.phone) {
      util.showToast('请填写完整信息', 'none')
      return
    }
    
    if (!util.validateIdCard(editingParticipant.idCard)) {
      util.showToast('身份证格式不正确', 'none')
      return
    }
    
    if (!util.validatePhone(editingParticipant.phone)) {
      util.showToast('手机号格式不正确', 'none')
      return
    }
    
    this.setData({
      participants: [editingParticipant],
      showParticipantModal: false
    })
    
    util.showToast('保存成功')
  },

  /**
   * 添加参与人
   */
  addParticipant() {
    this.setData({
      showParticipantModal: true,
      editingParticipant: { typeIndex: 0, type: '成人' }
    })
  },

  /**
   * 编辑联系人
   */
  editContact() {
    wx.showModal({
      title: '编辑联系人',
      content: '此功能暂未开放',
      showCancel: false
    })
  },

  /**
   * 发起支付
   */
  async handlePayment() {
    if (!this.data.agreedToTerms) {
      util.showToast('请先同意相关协议', 'none')
      return
    }
    
    if (!this.data.selectedPayMethod) {
      util.showToast('请选择支付方式', 'none')
      return
    }
    
    this.setData({ paying: true })
    
    try {
      // 模拟支付请求
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 这里应该调用真实的支付API
      // const payResult = await request.post('/api/payment', {...})
      
      util.showToast('支付成功')
      
      // 跳转到支付成功页面
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/payment-success/payment-success'
        })
      }, 1500)
      
    } catch (error) {
      console.error('支付失败:', error)
      util.showToast('支付失败，请重试', 'none')
    } finally {
      this.setData({ paying: false })
    }
  },

  /**
   * 显示协议
   */
  showTerms() {
    wx.showModal({
      title: '研学活动协议',
      content: '这里是详细的活动协议内容...',
      showCancel: false
    })
  },

  /**
   * 显示退款政策
   */
  showCancelPolicy() {
    wx.showModal({
      title: '退款政策',
      content: '这里是详细的退款政策...',
      showCancel: false
    })
  },

  /**
   * 阻止冒泡
   */
  stopPropagation() {
    // 空函数，阻止事件冒泡
  }
}) 