// dashboard.js
const ajax = require('../../assets/utils/request.js')
Page({
  data: {
    count: {
      houseCount: 0,
      leaseEmpty: 0,

      rentList1Count: 0,
      rentList1isTodayCount: 0,
      rentList1isTodayCountMoney: 0,

      rentList3Count: 0,
      rentList3isTodayCount: 0,
      rentList3isTodayCountMoney: 0,

      rentList3okCount: 0,
      rentList3okCountMoney: 0
    },
    newestMonth: ''
  },
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    Promise.all([
      new Promise((resolve, reject) => {
        this.bindGetCount(resolve, reject)
      }),
      new Promise((resolve, reject) => {
        this.bindGetCountType(1, resolve, reject)
      }),
      new Promise((resolve, reject) => {
        this.bindGetCountType(3, resolve, reject)
      }),
      new Promise((resolve, reject) => {
        this.bindGetOkCountType(3, resolve, reject)
      })
    ]).then((data) => {
      wx.hideLoading()
    }).catch(() => {})
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
      new Promise((resolve, reject) => {
        this.bindGetCount(resolve, reject)
      }),
      new Promise((resolve, reject) => {
        this.bindGetCountType(1, resolve, reject)
      }),
      new Promise((resolve, reject) => {
        this.bindGetCountType(3, resolve, reject)
      }),
      new Promise((resolve, reject) => {
        this.bindGetOkCountType(3, resolve, reject)
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
  bindGetCount(resolve, reject) {
    const that = this
    ajax('/inner/dash/count', {}, (res) => {
      const { houseCount, leaseEmpty } = res.data.data
      that.setData({
        'count.houseCount': houseCount,
        'count.leaseEmpty': leaseEmpty
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
  bindGetCountType(typ, resolve, reject) {
    const that = this
    ajax('/inner/dash/waitingListCount', {
      type: typ || 1
    }, (res) => {
      const { count, isTodayCount, isTodayCountMoney } = res.data.data
      const setType = {}
      setType['count.rentList' + (typ || 1) + 'Count'] = count
      setType['count.rentList' + (typ || 1) + 'isTodayCount'] = isTodayCount
      setType['count.rentList' + (typ || 1) + 'isTodayCountMoney'] = isTodayCountMoney
      that.setData(setType)
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
  bindGetOkCountType(typ, resolve, reject) {
    const that = this
    ajax('/inner/dash/okListCount', {
      type: typ || 3
    }, (res) => {
      const { count, isTodayCount, countMoney, month } = res.data.data
      const setType = {}
      setType['count.rentList' + (typ || 3) + 'okCount'] = count
      setType['count.rentList' + (typ || 3) + 'okisTodayCount'] = isTodayCount
      setType['count.rentList' + (typ || 3) + 'okCountMoney'] = countMoney
      setType.newestMonth = month
      that.setData(setType)
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
  bindGoPage(e) {
    const { type, url, ajax, ajaxtype, ajaxtoday } = e.currentTarget.dataset
    if (type == 'tab') {
      wx.switchTab({ url })
    } else if (type == 'page') {
      wx.navigateTo({
        url: '/pages/rent-filter/rent-filter?ajax=' + ajax
          + '&ajaxType=' + ajaxtype
          + '&ajaxToday=' + ajaxtoday
      })
    } else if (type == 'house') {
      wx.navigateTo({
        url: '/pages/house-filter/house-filter?ajax=' + ajax
      })
    } else {
      return false
    }
  }
})
