//month.js
//获取应用实例
const { typesVal, payTypeVal } = getApp().globalData
const ajax = require('../../assets/utils/request.js')
Page({
  data: {
    filter: '',
    filterShowed: false,
    month: {},
    houseDate: [],
    houseDateFiltered: [],
    typesVal,
    payTypeVal
  },
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 生命周期函数--监听页面加载
    Promise.all([
      new Promise((resolve, reject) => {
        this.bindGetMonth(resolve, reject)
      }),
      new Promise((resolve, reject) => {
        this.bindGetHouse(resolve, reject)
      })
    ]).then((data) => {
      wx.hideLoading()
    }).catch(() => {})
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
      new Promise((resolve, reject) => {
        this.bindGetMonth(resolve, reject)
      }),
      new Promise((resolve, reject) => {
        this.bindGetHouse(resolve, reject)
      })
    ]).then((data) => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '获取成功',
        icon: 'success',
        duration: 1000
      })
    }).catch(() => {
      wx.stopPullDownRefresh()
    })
    return false
  },
  onReachBottom() {
    // 页面上拉触底事件的处理函数
    return false
  },
  bindGetMonth(resolve, reject) {
    const that = this
    ajax('/inner/month/newest', {}, (res) => {
      that.setData({
        month: res.data.data
      })
      resolve && resolve()
    }, (res) => {
      wx.showToast({
        title: String(res.data.msg),
        image: '/assets/error.png',
        icon: 'loading',
        duration: 2000
      })
      reject && reject()
    })
  },
  bindGetHouse(resolve, reject) {
    const that = this
    ajax('/inner/rent/listByNewestMonth', {}, (res) => {
      that.setData({
        houseDate: res.data.data
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
      reject && reject()
    })
  },
  bindGetFilterDate() {
    const that = this
    let filter = []
    if (!that.data.filter) {
      filter = that.data.houseDate
    } else {
      filter = that.data.houseDate.filter((i) => {
        return String(i.fanghao).match(that.data.filter)
      })
    }
    that.setData({
      houseDateFiltered: filter
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
    const that = this
    wx.navigateTo({
      url: '/pages/month-rent/month-rent?haoId=' + e.currentTarget.dataset.id + '&monthId=' + that.data.month._id
    })
  }
})
