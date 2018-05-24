//index.js
//获取应用实例
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.login()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  login: function() {
    qcloud.setLoginUrl(config.service.loginUrl)

    /**
     * 进入初始页面，首先默认登录操作，获取基本信息
     */
    if (app.globalData.logged) return

    util.showBusy('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        var openId = ''
        if(result){
          openId = result.openId
        }
        if (openId !== null && openId !== undefined && openId !== '') {
          util.showSuccess('登录成功')
          app.globalData.userInfo = result
          console.log("userInfo")
          console.log(app.globalData.userInfo)
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              var openId = result.data.data.openId
              if (openId === null || openId === undefined || openId === '') {
                util.showModel('登录失败，请稍后再试', error)
                console.log('request fail', error)
              } else {
                app.globalData.userInfo = result.data.data
                util.showSuccess('登录成功')
                console.log(app.globalData.userInfo)
              }
            },

            fail(error) {
              util.showModel('登录失败，请稍后再试', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败，请稍后再试', error)
        console.log('登录失败', error)
      }
    })
  },

  jumpToFarmer: function() {
    var openId = app.globalData.userInfo.openId
    if(openId === null || openId === undefined || openId === ''){
      this.login()
    }else {
      wx.navigateTo({
        url: '../farmerindex/farmerindex',
      })
    }
  },

  jumpToFly: function () {
    var openId = app.globalData.userInfo.openId
    if (openId === null || openId === undefined || openId === '') {
      this.login()
    } else {
      wx.navigateTo({
        url: '../flyerindex/flyerindex',
      })
    }
  },

  jumpToDealer: function () {
    var openId = app.globalData.userInfo.openId
    if (openId === null || openId === undefined || openId === '') {
      this.login()
    } else {
      wx.navigateTo({
        url: '../dealerindex/dealerindex',
      })
    }
  },

  jumpToCommunication: function () {
    var openId = app.globalData.userInfo.openId
    if (openId === null || openId === undefined || openId === '') {
      this.login()
    } else {
      wx.showModal({
        title: '提示',
        content: '敬请期待',
        showCancel: false,
        confirmText: '好的',
        success: function (res) {
        }
      })
      // wx.navigateTo({
      //   url: '../dealerindex/dealerindex',
      // })
    }
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
