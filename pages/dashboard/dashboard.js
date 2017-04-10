// dashboard.js
let ajax = require('../../assets/utils/request.js')
Page({
    data: {
        count: {
            houseCount: 0,
            rentList1Count: 0,
            rentList1CountMoney: 0,
            rentList3Count: 0,
            rentList3CountMoney: 0,
            rentList1isToday: 0,
            rentList3isToday: 0
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
            }),
            new Promise((resolve) => {
                this.bindGetCountType(1, resolve)
            }),
            new Promise((resolve) => {
                this.bindGetCountType(3, resolve)
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
            }),
            new Promise((resolve) => {
                this.bindGetCountType(1, resolve)
            }),
            new Promise((resolve) => {
                this.bindGetCountType(3, resolve)
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
    },
    bindGetCountType(typ, resolve) {
        let that = this
        ajax('/inner/dash/waitingListCount', {
            type: typ || 1
        }, (res) => {
            let setType = {}
            setType['count.rentList' + (typ || 1) + 'Count'] = res.data.data.count
            setType['count.rentList' + (typ || 1) + 'CountMoney'] = res.data.data.countMoney
            setType['count.rentList' + (typ || 1) + 'isToday'] = res.data.data.isToday
            that.setData(setType)
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