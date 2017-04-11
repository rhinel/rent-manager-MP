//house-det.js
let ajax = require('../../assets/utils/request.js')
let formatDate = require('../../assets/utils/util.js').formatDate
Page({
    data: {
        loaded: false,
        id: '',
        det: {},
        payTypeVal: ['微信', '支付宝', '银行转账', '现金', '房东自收', '其他']
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
        Promise.all([
            new Promise((resolve) => {
                this.bindGetHouseDet(resolve)
            })
        ]).then((data) => {
            wx.stopPullDownRefresh()
            wx.showToast({
                title: '获取成功',
                icon: 'success',
                duration: 1000
            })
        })
    },
    onReachBottom() {
        // 页面上拉触底事件的处理函数

    },
    bindGetHouseDet(resolve) {
        let that = this
        ajax('/inner/house/detByHao', {
            haoId: that.data.id
        }, (res) => {
            let _data = res.data.data
            _data.leaseId.addTime = that.bindGetFormatDate(_data.leaseId.addTime)
            _data.leaseId.leaserange && (_data.leaseId.leaserange[0] = that.bindGetFormatDate(_data.leaseId.leaserange[0]))
            _data.leaseId.leaserange && (_data.leaseId.leaserange[1] = that.bindGetFormatDate(_data.leaseId.leaserange[1]))
            _data.waterId.addTime = that.bindGetFormatDate(_data.waterId.addTime)
            _data.electricId.addTime = that.bindGetFormatDate(_data.electricId.addTime)

            _data.waterId.result = that.bindCalResult(_data.leaseId.calWaterPrice, _data.waterId.water - (_data.calWaterId.tnew ? _data.calWaterId.tnew.water : 0))
            _data.electricId.result = that.bindCalResult(_data.leaseId.calElePrice, _data.electricId.electric - (_data.calElectricId.tnew ? _data.calElectricId.tnew.electric : 0))
            that.setData({
                det: _data
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
    },
    bindGetFormatDate(v) {
        return v && formatDate(new Date(v))
    },
    bindCalResult(data, theGap) {
        if (!data) {
            return 0
        }
        let result = 0
        theGap = theGap > 0 ? theGap : 0
        theGap = theGap > data.minPrice ? theGap : data.minPrice
        if (data.calType == 'single') {
            result = theGap * data.singlePrice
        } else {
            data.stepPrice.forEach((item, i, arr) => {
                if (theGap > (arr[i - 1] ? arr[i - 1].step : 0) && theGap <= item.step && item.price != 0) {
                    result = theGap * item.price
                } else if (i == (arr.length - 1) && theGap >= item.step && item.price != 0) {
                    result = theGap * item.price
                }
            })
            result = Math.round(result * 100) / 100
        }
        return result
    }
})