// pages/personalauthentication/personalauthentication.js
var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idImageFrontUrl: '../../images/order/image_front.png',
    idImageBackUrl: '../../images/order/image_back.png',
    realName: '',
    idNum: '',
    phoneNum: '',
    userInfo: {},
    disabled: false,
    buttonPart: 'button-submit',
    reAuthButtonPart: 'button-submit-hidden'
  },

  realNameInput: function(e) {
    this.setData({
      realName: e.detail.value
    })
  },

  idNumInput:function(e) {
    this.setData({
      idNum: e.detail.value
    })
  },

  phoneNumInput: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },

  /**
   * 重新认证
   */
  reAuth: function (e) {
    this.setData({
      idImageFrontUrl: '../../images/order/image_front.png',
      idImageBackUrl: '../../images/order/image_back.png',
      disabled: false,
      buttonPart: 'button-submit',
      reAuthButtonPart: 'button-submit-hidden'
    })
  },
  /**
   * 提交审核
   */
  sumbit: function (e) {
    if (this.data.realName === '') {
      wx.showModal({
        title: '提示',
        content: '请输入真实姓名',
        showCancel: false,
        confirmText: '知道了',
      })
      return
    }
    if (this.data.idNum === '') {
      wx.showModal({
        title: '提示',
        content: '请输入真实身份证号码',
        showCancel: false,
        confirmText: '知道了',
      })
      return
    }
    if (this.data.phoneNum === '') {
      wx.showModal({
        title: '提示',
        content: '请输入真实联系电话',
        showCancel: false,
        confirmText: '知道了',
      })
      return
    }
    if (this.data.idImageFrontUrl === '../../images/order/image_front.png') {
      wx.showModal({
        title: '提示',
        content: '请上传身份证正面照片',
        showCancel: false,
        confirmText: '知道了',
      })
      return
    }
    if (this.data.idImageBackUrl === '../../images/order/image_back.png') {
      wx.showModal({
        title: '提示',
        content: '请上传身份证反面照片',
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
      url: config.service.authUrl,
      data: {
        idImageFrontUrl: that.data.idImageFrontUrl,
        idImageBackUrl: that.data.idImageBackUrl,
        realName: that.data.realName,
        idNum: that.data.idNum,
        phoneNum: that.data.phoneNum,
        authType: '0',
        openId: app.globalData.userInfo.openId
      },
      success(result) {
        wx.hideToast();
        app.globalData.userInfo.authStatus = '2'
        app.globalData.userInfo.authStatusStr = '审核中'
        app.globalData.userInfo.authIdImageFront = that.data.idImageFrontUrl
        app.globalData.userInfo.authIdImageBack = that.data.idImageBackUrl
        app.globalData.userInfo.realName = that.data.realName
        app.globalData.userInfo.idNum = that.data.idNum
        app.globalData.userInfo.phoneNum = that.data.phoneNum
        app.globalData.userInfo.authType = '0'

        wx.showModal({
          title: '提示',
          content: '认证提交成功，请等待审核结果',
          showCancel: false,
          confirmText: '知道了',
          success: function (res) {
            if (res.confirm) {
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
    if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
      console.log('使用 qcloud.request 带登录态登录')
      qcloud.request(options)
    } else {    // 使用 wx.request 则不带登录态
      console.log('使用 wx.request 则不带登录态')
      wx.request(options)
    }
  },

  /**
    * 选择本地图片
    */
  choiceImages: function (e) {
    var that = this;
    var id = e.target.id
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function (res) {
            util.showSuccess('上传图片成功')
            console.log(res)
            res = JSON.parse(res.data)
            console.log(res)
            if(id === '0') {
              that.setData({
                idImageFrontUrl: res.data.imgUrl
              })
            }else if (id === '1') {
              that.setData({
                idImageBackUrl: res.data.imgUrl
              })
            }
          },

          fail: function (e) {
            util.showModel('上传图片失败')
          }
        })

      },
      fail: function (e) {
        console.error(e)
      }
    })
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

    if (app.globalData.userInfo.authStatus === '1') {
      this.setData({
        idImageFrontUrl: app.globalData.userInfo.authIdImageFront,
        idImageBackUrl: app.globalData.userInfo.authIdImageBack,
        disabled: true,
        buttonPart: 'button-submit-hidden'
      })
    } else if (app.globalData.userInfo.authStatus === '4') {
      this.setData({
        idImageFrontUrl: app.globalData.userInfo.authIdImageFront,
        idImageBackUrl: app.globalData.userInfo.authIdImageBack,
        disabled: true,
        buttonPart: 'button-submit-hidden',
        reAuthButtonPart: 'button-submit'
      })
    } else if (app.globalData.userInfo.authStatus === '2') {
      this.setData({
        idImageFrontUrl: app.globalData.userInfo.authIdImageFront,
        idImageBackUrl: app.globalData.userInfo.authIdImageBack,
        disabled: true,
        buttonPart: 'button-submit-hidden',
        reAuthButtonPart: 'button-submit-hidden'
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