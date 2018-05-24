//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js')
App({
  onLaunch: function () {
    // qcloud.setLoginUrl(config.service.loginUrl)

    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // /**
    //  * 进入初始页面，首先默认登录操作，获取基本信息
    //  */
    // if (this.globalData.logged) return

    // util.showBusy('正在登录')
    // var that = this

    // // 调用登录接口
    // qcloud.login({
    //   success(result) {
    //     if (result) {
    //       util.showSuccess('登录成功')
    //       that.globalData.userInfo = result
    //       console.log("userInfo")
    //       console.log(that.globalData.userInfo)
    //     } else {
    //       // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
    //       qcloud.request({
    //         url: config.service.requestUrl,
    //         login: true,
    //         success(result) {
    //           that.globalData.userInfo = result.data.data
    //           util.showSuccess('登录成功')
    //           console.log("userInfo1")
    //           console.log(that.globalData.userInfo)
    //         },

    //         fail(error) {
    //           util.showModel('请求失败', error)
    //           console.log('request fail', error)
    //         }
    //       })
    //     }
    //   },

    //   fail(error) {
    //     util.showModel('登录失败', error)
    //     console.log('登录失败', error)
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    logged: false,
    takeSession: false,
    requestResult: '',
    currentIdentify: '飞手',
    isReAuth: '0'  //是否重新实名认证
  }
})