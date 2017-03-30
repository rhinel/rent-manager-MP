//index.js
//获取应用实例
let app = getApp()
let md5 = require('../../assets/utils/md5.js')
let ajax = require('../../assets/utils/request.js')
Page({
  // data
  data: {
    userInfo: {},
    login: {
      name: '',
      pwd: ''
    },
    loginVD: {
      name: true,
      pwd: true
    }
  },
  // 生命周期
  onLoad() {
    let that = this
    // 调用应用实例的方法获取全局数据
    app.getUserInfo((userInfo) => {
      // 更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    ajax('/inner/auth/check', {}, (res) => {
      wx.switchTab({
        url: '/pages/water/water'
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
    wx.showToast({
      title: '登陆中',
      icon: 'loading',
      mask: true,
      duration: 2000000
    })
    ajax('/outer/log/login', {
      name: this.data.login.name,
      pwd: md5(this.data.login.pwd)
    }, (res) => {
      wx.showToast({
        title: '登陆成功',
        icon: 'success',
        duration: 1000
      })
      wx.setStorageSync('token', res.data.data)
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/water/water'
        })
      }, 1000)
    }, (res) => {
      wx.showToast({
        title: '输入错误', // String(res.data.msg)
        icon: 'loading',
        image: '../../assets/error.png',
        duration: 2000
      })
    })
  }
})
