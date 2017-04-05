//house-det.js
let ajax = require('../../assets/utils/request.js')
Page({
    data: {
        loaded: false,
        id: '',
        det: {}
    },
    onLoad(options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 2000000
        })
        // 生命周期函数--监听页面加载
        this.setData({
            id: options.id
        })
        Promise.all([
            new Promise((resolve) => {
                this.bindGetHouseDet(resolve)
            })
        ]).then((data) => {
            this.setData({
                loaded: true
            })
            wx.hideToast()
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

    },
    onReachBottom() {
        // 页面上拉触底事件的处理函数

    },
    bindGetHouseDet(resolve) {
        let that = this
        ajax('/inner/rent/detByHao', {
            haoId: that.data.id
        }, (res) => {
            that.setData({
                det: res.data.data
            })
            wx.setNavigationBarTitle({
                title: res.data.data.fanghao
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