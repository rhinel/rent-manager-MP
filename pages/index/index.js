//index.js
//获取应用实例
var app = getApp()
Page({
  // data
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  // 生命周期
  onLoad: function () {
    console.log('onLoad')
    var that = this
    // 调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      // 更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  // 方法定义
  bindViewTap: function () {
    wx.switchTab({
      url: '../water/water'
    })
  }
})
