// pages/authentication/authentication.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
  },

  jumpToAuthentication: function (e) {
    if (this.data.userInfo.authStatus === '1' || this.data.userInfo.authStatus === '4' || this.data.userInfo.authStatus === '2'){
      if (this.data.userInfo.authType === '0') {
        wx.navigateTo({
          url: '../personalauthentication/personalauthentication',
        })
      } else if (this.data.userInfo.authType === '1') {
        wx.navigateTo({
          url: '../companyauthentication/companyauthentication',
        })
      }
    } else if (this.data.userInfo.authStatus === '0') {
      wx.navigateTo({
        url: '../authenticationtype/authenticationtype',
      })
    }
  },

  modifyName: function (e) {
    wx.navigateTo({
      url: '../modifyname/modifyname',
    })
  },

  modifyPhone: function (e) {
    wx.navigateTo({
      url: '../modifyphone/modifyphone',
    })
  },

  modifyAddress: function (e) {
    wx.navigateTo({
      url: '../modifyaddress/modifyaddress',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})