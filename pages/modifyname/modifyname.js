// pages/modifyname/modifyname.js
var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    realName: ''
  },

  /**
   * 真实姓名输入
   */
  realNameInput: function(e) {
    this.setData({
      realName: e.detail.value
    })
  },

  /**
   * 修改提交
   */
  sumbit: function(e) {

    if (this.data.realName === '') {
      wx.showModal({
        title: '提示',
        content: '请输入真实姓名',
        showCancel: false,
        confirmText: '知道了',
      })
      return
    }
    // 提交认证
    util.showBusy('请求中...')
    var that = this
    console.log(that.data.companyName)
    var options = {
      url: config.service.modifyUserInfoUrl,
      data: {
        realName: that.data.realName,
        openId: app.globalData.userInfo.openId
      },
      success(result) {
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '修改成功',
          showCancel: false,
          confirmText: '知道了',
          success: function (res) {
            if (res.confirm) {
              app.globalData.userInfo.realName = that.data.realName
              wx.navigateBack({  //返回
                delta: 1
              })
            }
          }
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }
    console.log('使用 qcloud.request 带登录态登录')
    qcloud.request(options)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
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