//month-det.js
let ajax = require('../../assets/utils/request.js')
let formatDate = require('../../assets/utils/util.js').formatDate
Page({
    data: {
        loaded: false,
        haoId: '',
        monthId: '',
        detList: {},
        typesVal: ['', '已交', '给单', '房东'],
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
            haoId: options.haoId,
            monthId: options.monthId
        })
        Promise.all([
            new Promise((resolve) => {
                this.bindGetRentDet(resolve)
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
                this.bindGetRentDet(resolve)
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
    bindGetRentDet(resolve) {
        let that = this
        ajax('/inner/rent/listByHaoAndMonth', {
            haoId: that.data.haoId,
            monthId: that.data.monthId
        }, (res) => {
            let r_data = res.data.data
            r_data.forEach((_data) => {
                if (_data) {
                    // 租住的时间显示
                    _data.lease.addTime = that.bindGetFormatDate(_data.lease.addTime)
                    _data.lease.leaserange && (_data.lease.leaserange[0] = that.bindGetFormatDate(_data.lease.leaserange[0]))
                    _data.lease.leaserange && (_data.lease.leaserange[1] = that.bindGetFormatDate(_data.lease.leaserange[1]))
                    // 水表的时间显示
                    _data.calWater.addTime = that.bindGetFormatDate(_data.calWater.addTime)
                    _data.calWater.tnew.addTime = that.bindGetFormatDate(_data.calWater.tnew.addTime)
                    _data.calWater.old.addTime = that.bindGetFormatDate(_data.calWater.old.addTime)
                    // 电表的时间显示
                    _data.calElectric.addTime = that.bindGetFormatDate(_data.calElectric.addTime)
                    _data.calElectric.tnew.addTime = that.bindGetFormatDate(_data.calElectric.tnew.addTime)
                    _data.calElectric.old.addTime = that.bindGetFormatDate(_data.calElectric.old.addTime)
                    // 计租时间
                    _data.addTime = that.bindGetFormatDate(_data.addTime)
                    if (_data.type) {
                        for (var i in _data.type.typeTime) {
                            _data.type.typeTime[i] = that.bindGetFormatDate(_data.type.typeTime[i])
                        }
                    }
                    _data.show = false
                }
            })
            that.setData({
                detList: r_data
            })
            wx.setNavigationBarTitle({
                title: res.data.data[0] ? res.data.data[0].fanghao : '暂无数据'
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
    bindToggle(e) {
        let that = this
        let param = {}
        param['detList[' + e.currentTarget.dataset.index + '].show'] = !that.data.detList[e.currentTarget.dataset.index].show
        that.setData(param)
    },
    bindGoToDet(e) {
        let that = this
        wx.navigateTo({
            url: '/pages/month-rent-det/month-rent-det?rentId=' + e.currentTarget.dataset.id
        })
    }
})