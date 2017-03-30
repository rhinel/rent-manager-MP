//wande.js
let ajax = require('../../assets/utils/request.js')
let formatDate = require('../../assets/utils/util.js').formatDate
let sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置
Page({
  // data
  data: {
    tabs: ["水表", "电表"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    waterDateView: formatDate(new Date()),
    waterDateViewShowed: false,
  },
  // 生命周期
  onLoad(options) {
    // 生命周期函数--监听页面加载
    var that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    })
    ajax('/inner/auth/check', {}, (res) => { }, (res) => {
      wx.redirectTo({
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
    wx.stopPullDownRefresh()
    return false
  },
  onReachBottom() {
    // 页面上拉触底事件的处理函数
    return false
  },
  // 方法定义
  tabClick(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
  },
  bindWaterDateChange(e) {
    this.setData({
      waterDateView: e.detail.value
    })
  }
})