// month-rent.js
let ajax = require('../../assets/utils/request.js')
Page({
    data: {

    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        ajax('/inner/auth/check', {}, (res) => { }, (res) => {
            wx.reLaunch({
                url: '/pages/index/index'
            })
        })
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function () {
        // 生命周期函数--监听页面显示

    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作
        wx.stopPullDownRefresh()
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数

    }
})