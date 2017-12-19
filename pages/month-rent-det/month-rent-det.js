//house-det.js
//获取应用实例
const { payTypeVal } = getApp().globalData
const ajax = require('../../assets/utils/request.js')
const formatDate = require('../../assets/utils/util.js').formatDate
Page({
  data: {
    loaded: false,
    rentId: '',
    det: {},
    payTypeVal,
    types: [
      { label: '已交', value: 1 },
      { label: '给单', value: 2 },
      { label: '房东', value: 3 }
    ],
    changeType: {
      rentId: '',
      type: [],
      typeTime: {
        1: '',
        2: '',
        3: ''
      },
      isIndeterminate: false,
      checkAll: false,

      payType: 0,
      remark: ''
    }
  },
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 生命周期函数--监听页面加载
    this.setData({
      rentId: options.rentId,
      'changeType.rentId': options.rentId
    })
    Promise.all([
      new Promise((resolve) => {
        this.bindGetRentDet(resolve)
      })
    ]).then((data) => {
      this.setData({
        loaded: true
      })
      wx.hideLoading()
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
  bindGetFormatDate(v) {
    return v && formatDate(new Date(v))
  },
  bindGetRentDet(resolve) {
    const that = this
    ajax('/inner/rent/one', {
      rentId: that.data.rentId
    }, (res) => {
      const _data = res.data.data
      _data.addTime = that.bindGetFormatDate(_data.addTime)
      if (_data.type) {
        for (var i in _data.type.typeTime) {
          _data.type.typeTime[i] = that.bindGetFormatDate(_data.type.typeTime[i])
        }
      }
      that.setData({
        det: _data,
        'changeType.payType': _data.lease.payType,
        'changeType.remark': _data.remark,
        'changeType.type': _data.type && _data.type.type || [],
        'changeType.typeTime': _data.type && _data.type.typeTime || {
          1: '',
          2: '',
          3: ''
        },
        'changeType.isIndeterminate': _data.type && _data.type.isIndeterminate || false,
        'changeType.checkAll': _data.type && _data.type.checkAll || false
      })
      wx.setNavigationBarTitle({
        title: res.data.data ? res.data.data.fanghao : '暂无数据'
      })
      resolve && resolve()
    }, (res) => {
      wx.showToast({
        title: String(res.data.msg),
        image: '/assets/error.png',
        icon: 'loading',
        duration: 2000
      })
    })
  },
  bindTypePickerChange(e) {
    const that = this
    that.setData({
      'changeType.payType': e ? e.detail.value : -1
    })
  },
  bindKeyTypeRemark(e) {
    const that = this
    that.setData({
      'changeType.remark': e ? e.detail.value : -1
    })
  },
  bindSwitchChange(e) {
    const that = this
    const value = e.currentTarget.dataset.value
    const types = that.data.changeType.type
    const index = types.indexOf(value)
    let checkAll = false
    let isIndeterminate = false
    let data = {}
    if (e.detail.value) {
      index > -1 || types.push(value)
    } else {
      index > -1 && types.splice(index, 1)
    }
    if (types.length > 0 && types.length < 3) {
      isIndeterminate = true
    } else if (types.length == 3) {
      checkAll = true
    }
    if (!that.data.changeType.typeTime[value] && e.detail.value) {
      data['changeType.typeTime.' + value] = formatDate(new Date())
    } else if (!e.detail.value) {
      data['changeType.typeTime.' + value] = ''
    }
    data = Object.assign({}, data, {
      'changeType.type': types,
      'changeType.isIndeterminate': isIndeterminate,
      'changeType.checkAll': checkAll
    })
    that.setData(data)
  },
  bindTypeDateChange(e) {
    const that = this
    const value = e.currentTarget.dataset.value
    const data = {}
    data['changeType.typeTime.' + value] = e ? e.detail.value : formatDate(new Date())
    that.setData(data)
  },
  bindGetTypesChange(resolve) {
    const that = this
    wx.showToast({
      title: '修改中',
      icon: 'loading',
      mask: true,
      duration: 2000000
    })
    ajax('/inner/rent/type', that.data.changeType, (res) => {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1000
      })
    }, (res) => {
      wx.showToast({
        title: String(res.data.msg),
        image: '/assets/error.png',
        icon: 'loading',
        duration: 2000
      })
    })
  }
})
