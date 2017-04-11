// house.js
let ajax = require('../../assets/utils/request.js')
let formatDate = require('../../assets/utils/util.js').formatDate
Page({
    data: {
        filter: '',
        filterShowed: false,
        houseDate: [],
        houseDateFiltered: [],
        typesVal: ['', '已交', '给单', '房东'],
        payTypeVal: ['微信', '支付宝', '银行转账', '现金', '房东自收', '其他']
    },
    onLoad(options) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 2000000
        })
        Promise.all([
            new Promise((resolve) => {
                this.bindGetHouse(resolve)
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
    bindGetHouse(resolve) {
        let that = this
        ajax('/inner/lease/mainList', {}, (res) => {
            res.data.data.forEach((i) => {
                i.leaseId.status == 1 && (i.leaseId.leaserange[1] = that.bindGetFormatDate(i.leaseId.leaserange[1]))
            })
            that.setData({
                houseDate: res.data.data
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
        let that = this
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
    bindGetFormatDate(v) {
        return v && formatDate(new Date(v))
    },
    bindGoToDet(e) {
        let that = this
        wx.navigateTo({
            url: '/pages/house-det/house-det?id=' + e.currentTarget.dataset.id
        })
    }
})