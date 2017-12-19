//rent-filter.js
//获取应用实例
const { typesVal, payTypeVal } = getApp().globalData
const ajax = require('../../assets/utils/request.js')
Page({
  data: {
    ajax: '',
    ajaxType: '',
    ajaxToday: '',
    filter: '',
    filterShowed: false,
    title: '',
    rentDate: [],
    rentDateFiltered: [],
    typesVal,
    payTypeVal
  },
  onLoad(options) {
    this.setData({
      ajax: options.ajax,
      ajaxType: Number(options.ajaxType),
      ajaxToday: Number(options.ajaxToday)
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 生命周期函数--监听页面加载
    Promise.all([
      new Promise((resolve) => {
        this.bindGetRent(resolve)
      })
    ]).then((data) => {
      wx.hideLoading()
      })
    ajax('/inner/auth/check', {}, (res) => { }, (res) => {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    })
  },
  onReady() {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow() {
    // 生命周期函数--监听页面显示

  },
  onHide() {
    // 生命周期函数--监听页面隐藏

  },
  onUnload() {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh() {
    // 页面相关事件处理函数--监听用户下拉动作
    Promise.all([
      new Promise((resolve) => {
        this.bindGetRent(resolve)
      })
    ]).then((data) => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '获取成功',
        icon: 'success',
        duration: 1000
      })
    })
    return false
  },
  onReachBottom() {
    // 页面上拉触底事件的处理函数
    return false
  },
  bindGetRent(resolve) {
    const that = this
    let url = ''
    let content = ''
    let key = ''
    // 判断类型
    if (that.data.ajax == 'waiting') {
      url = '/inner/dash/waitingList'
      if (that.data.ajaxType == 1) {
        content = '待收租金'
      } else if (that.data.ajaxType == 3) {
        content = '待交房东'
      }
      key = 'data'
      if (that.data.ajaxToday == 1) {
        content = '今日' + content
        key = 'isToday'
      }
    } else if (that.data.ajax == 'ok') {
      url = '/inner/dash/okList'
      content = '月已交房东'
      key = 'data'
    } else {
      url = '/inner/dash/leaseEmptyList'
      content = '房屋空置'
      key = 'data'
    }
    ajax(url, {
      type: that.data.ajaxType
    }, (res) => {
      res.data.data.month && (content = res.data.data.month + content)
      wx.setNavigationBarTitle({
        title: content
      })
      that.setData({
        rentDate: res.data.data[key],
        title: content
      })
      that.bindGetFilterDate()
      resolve && resolve()
    }, (res) => {
      wx.showToast({
        title: String(res.data.msg),
        image: '/assets/error.png',
        icon: 'loading',
        duration: 2000
      })
    })
  },
  bindGetFilterDate() {
    const that = this
    let filter = []
    if (!that.data.filter) {
      filter = that.data.rentDate
    } else {
      filter = that.data.rentDate.filter((i) => {
        return String(i.fanghao).match(that.data.filter)
      })
    }
    that.setData({
      rentDateFiltered: filter
    })
  },
  bindGetFilter(e) {
    this.setData({
      filter: e.detail.value
    })
    this.bindGetFilterDate()
  },
  bindGetShowFilter() {
    this.setData({
      filterShowed: true
    })
  },
  bindGetHideFilter() {
    this.setData({
      filter: '',
      filterShowed: false
    })
    this.bindGetFilterDate()
  },
  bindGetClearFilter() {
    this.setData({
      filter: '',
      filterShowed: true
    })
    this.bindGetFilterDate()
  },
  bindGoToDet(e) {
    const { id, monthid } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/month-rent/month-rent?haoId=' + id + '&monthId=' + monthid
    })
  }
})
