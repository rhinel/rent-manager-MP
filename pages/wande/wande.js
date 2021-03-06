//wande.js
const ajax = require('../../assets/utils/request.js')
const formatDate = require('../../assets/utils/util.js').formatDate
const sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置
Page({
  // data
  data: {
    tabs: ["水表", "电表"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    houseList: [],

    today: formatDate(new Date()),
    waterDateView: formatDate(new Date()),
    waterDate: [],
    addWater: {
      haoId: '',
      water: '',
      remark: '',
      addTime: formatDate(new Date())
    },
    addWaterVD: {
      haoId: true,
      water: true,
      remark: true,
      addTime: true
    },
    addWaterSelect: {
      haoIndex: 0
    },

    electricDateView: formatDate(new Date()),
    electricDate: [],
    addElectric: {
      haoId: '',
      electric: '',
      remark: '',
      addTime: formatDate(new Date())
    },
    addElectricVD: {
      haoId: true,
      electric: true,
      remark: true,
      addTime: true
    },
    addElectricSelect: {
      haoIndex: 0
    }
  },
  // 生命周期
  onLoad(options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 生命周期函数--监听页面加载
    const that = this
    // 处理sliderWidth
    wx.getSystemInfo({
      success(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        })
      }
    })
    // 获取数据
    Promise.all([
      new Promise((resolve, reject) => {
        this.bindGetHouse(resolve, reject)
      }),
      new Promise((resolve, reject) => {
        this.bindWaterDateChange(false, resolve, reject)
      }),
      new Promise((resolve, reject) => {
        this.bindElectricDateChange(false, resolve, reject)
      })
    ]).then((data) => {
      wx.hideLoading()
    }).catch(() => {})
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
      new Promise((resolve, reject) => {
        this.bindGetHouse(resolve, reject)
      }),
      new Promise((resolve, reject) => {
        this.bindWaterDateChange(false, resolve, reject)
      }),
      new Promise((resolve, reject) => {
        this.bindElectricDateChange(false, resolve, reject)
      })
    ]).then((data) => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '获取成功',
        icon: 'success',
        duration: 1000
      })
    }).catch(() => {
      wx.stopPullDownRefresh()
    })
    return false
  },
  onReachBottom() {
    // 页面上拉触底事件的处理函数
    return false
  },
  // 方法定义
  tabClick(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
  },
  bindGetFormatDate(v) {
    return v && formatDate(new Date(v))
  },
  bindGetHouse(resolve, reject) {
    const that = this
    ajax('/inner/house/listWithCal', {}, (res) => {
      const { data } = res.data
      data.forEach(item => {
        item.calElectrics.forEach(jtem => {
          jtem.tnew.addTime = that.bindGetFormatDate(jtem.tnew.addTime)
        })
        item.calWaters.forEach(jtem => {
          jtem.tnew.addTime = that.bindGetFormatDate(jtem.tnew.addTime)
        })
      })
      if (!data.length) {
        data.push({
          _id: '',
          fanghao: '暂无数据',
          disabled: true
        })
      }
      that.setData({
        houseList: data,
        // 'addWaterSelect.haoIndex': 0,
        'addWater.haoId': data[0] ? data[0]._id : '',
        'addWaterVD.haoId': true,
        // 'addElectricSelect.haoIndex': 0,
        'addElectric.haoId': data[0] ? data[0]._id : '',
        'addElectricVD.haoId': true
      })
      resolve && resolve()
    }, (res) => {
      wx.showToast({
        title: String(res.data.msg),
        image: '/assets/error.png',
        icon: 'loading',
        duration: 2000
      })
      reject && reject()
    })
  },

  bindWaterDateChange(e, resolve, reject) {
    const that = this
    that.setData({
      waterDateView: e ? e.detail.value : that.data.waterDateView
    })
    // 获取数据
    e !== false && wx.showLoading({
      title: '获取中',
      mask: true
    })
    ajax('/inner/water/findByDate', {
      waterDate: that.data.waterDateView
    }, (res) => {
      that.setData({
        waterDate: res.data.data
      })
      e !== false && wx.hideLoading()
      e !== false && wx.showToast({
        title: '获取成功',
        icon: 'success',
        duration: 1000
      })
      resolve && resolve()
    }, (res) => {
      e !== false && wx.hideLoading()
      wx.showToast({
        title: String(res.data.msg),
        image: '/assets/error.png',
        icon: 'loading',
        duration: 2000
      })
      reject && reject()
    })
  },

  bindHouseWaterPickerChange(e) {
    const that = this
    that.setData({
      'addWaterSelect.haoIndex': e ? e.detail.value : '',
      'addWater.haoId': e ? that.data.houseList[e.detail.value]._id : '',
      'addWaterVD.haoId': true
    })
  },
  bindKeyInputWater(e) {
    this.setData({
      'addWater.water': e ? e.detail.value : '',
      'addWaterVD.water': true
    })
  },
  bindAddWaterDateChange(e) {
    this.setData({
      'addWater.addTime': e ? e.detail.value : '',
      'addWaterVD.addTime': true
    })
  },
  bindKeyInputWaterRemark(e) {
    this.setData({
      'addWater.remark': e ? e.detail.value : '',
      'addWaterVD.remark': true
    })
  },
  bindWaterGoToToday(e) {
    this.bindWaterDateChange({
      detail: {
        value: this.data.today
      }
    })
  },

  bindAddWater(e) {
    let that = this
    that.setData({
      'addWaterVD.haoId': !!that.data.addWater.haoId,
      'addWaterVD.water': !!that.data.addWater.water,
      'addWaterVD.addTime': !!that.data.addWater.addTime
    })
    if (!this.data.addWaterVD.haoId || !this.data.addWaterVD.water || !this.data.addWaterVD.addTime) {
      return
    }
    // 添加水表记录
    wx.showLoading({
      title: '抄表中',
      mask: true
    })
    ajax('/inner/water/add', that.data.addWater, (res) => {
      wx.hideLoading()
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1000
      })
      that.data.addWater.addTime == that.data.waterDateView && that.bindWaterDateChange(false)
      that.setData({
        'addWater.water': ''
      })
    }, (res) => {
      wx.hideLoading()
      wx.showToast({
        title: String(res.data.msg),
        image: '/assets/error.png',
        icon: 'loading',
        duration: 2000
      })
    })
  },

  bindElectricDateChange(e, resolve, reject) {
    let that = this
    that.setData({
      electricDateView: e ? e.detail.value : that.data.electricDateView
    })
    // 获取数据
    e !== false && wx.showLoading({
      title: '获取中',
      mask: true
    })
    ajax('/inner/electric/findByDate', {
      electricDate: that.data.electricDateView
    }, (res) => {
      that.setData({
        electricDate: res.data.data
      })
      e !== false && wx.hideLoading()
      e !== false && wx.showToast({
        title: '获取成功',
        icon: 'success',
        duration: 1000
      })
      resolve && resolve()
    }, (res) => {
      e !== false && wx.hideLoading()
      wx.showToast({
        title: String(res.data.msg),
        image: '/assets/error.png',
        icon: 'loading',
        duration: 2000
      })
      reject && reject()
    })
  },

  bindHouseElectricPickerChange(e) {
    const that = this
    that.setData({
      'addElectricSelect.haoIndex': e ? e.detail.value : '',
      'addElectric.haoId': e ? that.data.houseList[e.detail.value]._id : '',
      'addElectricVD.haoId': true
    })
  },
  bindKeyInputElectric(e) {
    this.setData({
      'addElectric.electric': e ? e.detail.value : '',
      'addElectricVD.electric': true
    })
  },
  bindAddElectricDateChange(e) {
    this.setData({
      'addElectric.addTime': e ? e.detail.value : '',
      'addElectricVD.addTime': true
    })
  },
  bindKeyInputElectricRemark(e) {
    this.setData({
      'addElectric.remark': e ? e.detail.value : '',
      'addElectricVD.remark': true
    })
  },
  bindElectricGoToToday(e) {
    this.bindElectricDateChange({
      detail: {
        value: this.data.today
      }
    })
  },

  bindAddElectric(e) {
    const that = this
    that.setData({
      'addElectricVD.haoId': !!that.data.addElectric.haoId,
      'addElectricVD.electric': !!that.data.addElectric.electric,
      'addElectricVD.addTime': !!that.data.addElectric.addTime
    })
    if (!this.data.addElectricVD.haoId ||
      !this.data.addElectricVD.electric ||
      !this.data.addElectricVD.addTime
    ) {
      return
    }
    // 添加电表记录
    wx.showLoading({
      title: '抄表中',
      mask: true
    })
    ajax('/inner/electric/add', that.data.addElectric, () => {
      wx.hideLoading()
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1000
      })
      that.data.addElectric.addTime == that.data.electricDateView && that.bindElectricDateChange(false)
      that.setData({
        'addElectric.electric': ''
      })
    }, (res) => {
      wx.hideLoading()
      wx.showToast({
        title: String(res.data.msg),
        image: '/assets/error.png',
        icon: 'loading',
        duration: 2000
      })
    })
  }
})
