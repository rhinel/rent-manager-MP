// dashboard.js
let ajax = require('../../assets/utils/request.js')
Page({
    data: {
        count: {
            houseCount: 0,
            rentList1Count: 0,
            rentList3Count: 0
        }
    },
    onLoad(options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 2000000
        })
        Promise.all([
            new Promise((resolve) => {
                this.bindGetCount(resolve)
            })
        ]).then((data) => {
            wx.hideToast()
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
                this.bindGetCount(resolve)
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
    bindGetCount(resolve) {
        let that = this
        ajax('/inner/dash/count', {}, (res) => {
            that.setData({
                count: res.data.data
            })
            resolve && resolve()
        }, (res) => {
            wx.showToast({
                title: String(res.data.msg),
                image: '../../assets/error.png',
                icon: 'loading',
                duration: 2000
            })
        })
    }
})