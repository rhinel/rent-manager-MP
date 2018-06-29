//index.js
const md5 = require('../../assets/utils/md5.js')
const ajax = require('../../assets/utils/request.js')
Page({
  // data
  data: {
    login: {
      name: 'xiong',
      pwd: ''
    },
    loginVD: {
      name: true,
      pwd: true
    }
  },
  // 生命周期
  onLoad() {
    ajax('/inner/auth/check', {}, (res) => {
      wx.switchTab({
        url: '/pages/dashboard/dashboard'
      })
    }, (res) => { })
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
  bindKeyInputName(e) {
    this.setData({
      'login.name': e.detail.value,
      'loginVD.name': true
    })
  },
  bindKeyInputPwd(e) {
    this.setData({
      'login.pwd': e.detail.value,
      'loginVD.pwd': true
    })
  },
  bindViewTap() {
    this.setData({
      'loginVD.name': !!this.data.login.name
    })
    this.setData({
      'loginVD.pwd': !!this.data.login.pwd
    })
    if (!this.data.loginVD.name || !this.data.loginVD.pwd) {
      return
    }
    // 请求登陆
    wx.showLoading({
      title: '登陆中',
      mask: true
    })
    ajax('/outer/log/login', {
      name: this.data.login.name,
      pwd: md5(this.data.login.pwd)
    }, (res) => {
      wx.hideLoading()
      wx.showToast({
        title: '登陆成功',
        icon: 'success',
        duration: 1000
      })
      wx.setStorageSync('token', res.data.data)
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/dashboard/dashboard'
        })
      }, 1000)
    }, (res) => {
      wx.showToast({
        title: '输入错误',
        image: '/assets/error.png',
        icon: 'loading',
        duration: 2000
      })
    })
  }
})
