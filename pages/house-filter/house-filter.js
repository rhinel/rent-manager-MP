// house-filter.js
//获取应用实例
const { typesVal, payTypeVal } = getApp().globalData
const ajax = require('../../assets/utils/request.js')
const formatDate = require('../../assets/utils/util.js').formatDate
Page({
  data: {
    ajax: '',
    filter: '',
    filterShowed: false,
    houseDate: [],
    houseDateFiltered: [],
    typesVal,
    payTypeVal
  },
  onLoad(options) {
    this.setData({
      ajax: options.ajax || 'leaseEmpty'
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    Promise.all([
      new Promise((resolve) => {
        this.bindGetHouse(resolve)
      })
    ]).then((data) => {
      wx.hideLoading()
    })
    // 生命周期函数--监听页面加载
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
        this.bindGetHouse(resolve)
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
  bindGetFormatDate(v) {
    return v && formatDate(new Date(v))
  },
  bindGetHouse(resolve) {
    const that = this
    let url = ''
    if (that.data.ajax === 'leaseEmpty') {
      url = '/inner/dash/leaseEmptyList'
    }
    ajax(url, {}, (res) => {
      const { data } = res.data
      data.forEach((i) => {
        if (i.leaseId && i.leaseId.status === 1) {
          i.leaseId.leaserange[1] = that.bindGetFormatDate(i.leaseId.leaserange[1])
        }
      })
      wx.setNavigationBarTitle({
        title: '空置列表'
      })
      that.setData({
        houseDate: data
      })
      that.bindGetFilterDate()
      resolve && resolve()
    }, (res) => {
      wx.showToast({
        title: String(res.data.msg),
        image: '../../assets/error.png',
        icon: 'loading',
        duration: 2000
      })
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
      url: '/pages/house-det/house-det?id=' + e.currentTarget.dataset.id
    })
  }
})
