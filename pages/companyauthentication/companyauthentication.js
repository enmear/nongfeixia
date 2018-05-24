// pages/companyauthentication/companyauthentication.js
var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyImageUrl: '../../images/order/zhizhao.png',
    companyName: '',
    phoneNum: '',
    userInfo: {},
    disabled: false,
    buttonPart: 'button-submit',
    reAuthButtonPart: 'button-submit-hidden'
  },

  /**
   * 公司名称输入
   */
  companyNameInput: function(e) {
    console.log(e)
    this.setData({
      companyName: e.detail.value
    })
  },

  /**
   * 联系电话输入
   */
  phoneNumInput: function (e) {
    console.log(e)
    this.setData({
      phoneNum: e.detail.value
    })
  },

  /**
     * 重新认证
     */
  reAuth: function (e) {
    // app.globalData.isReAuth = '1'
    // wx.redirectTo({
    //   url: '../authenticationtype/authenticationtype',
    // })
    this.setData({
      companyImageUrl: '../../image/order/add_image.png',
      disabled: false,
      buttonPart: 'button-submit',
      reAuthButtonPart: 'button-submit-hidden'
    })
  },
  /**
   * 提交审核
   */
  sumbit: function(e) {
    if (this.data.companyName === '') {
      wx.showModal({
        title: '提示',
        content: '请输入公司名称',
        showCancel: false,
        confirmText: '知道了',
      })
      return
    }

    if (this.data.phoneNum === '') {
      wx.showModal({
        title: '提示',
        content: '请输入联系电话',
        showCancel: false,
        confirmText: '知道了',
      })
      return
    }

    if (this.data.companyImageUrl === '../../image/order/add_image.png') {
      wx.showModal({
        title: '提示',
        content: '请上传公司营业执照照片',
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
        companyImageUrl: that.data.companyImageUrl,
        companyName: that.data.companyName,
        phoneNum: that.data.phoneNum,
        authType: '1',
        openId: app.globalData.userInfo.openId
      },
      success(result) {
        wx.hideToast()
        app.globalData.userInfo.authStatus = '2'
        app.globalData.userInfo.authStatusStr = '审核中'
        app.globalData.userInfo.authCompanyImage = that.data.companyImageUrl
        app.globalData.userInfo.companyName = that.data.companyName
        app.globalData.userInfo.phoneNum = that.data.phoneNum
        app.globalData.userInfo.authType = '1'
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
    console.log('使用 qcloud.request 带登录态登录')
    qcloud.request(options)
  },

  /**
     * 选择本地图片
     */
  choiceImages: function (e) {
    var that = this;
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
            that.setData({
              companyImageUrl: res.data.imgUrl
            })
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

  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.companyImageUrl,
      urls: [this.data.companyImageUrl]
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
      this.setData ({
        companyImageUrl: app.globalData.userInfo.authCompanyImage,
        disabled: true,
        buttonPart: 'button-submit-hidden'
      })
    } else if (app.globalData.userInfo.authStatus === '4') {
      this.setData({
        companyImageUrl: app.globalData.userInfo.authCompanyImage,
        disabled: true,
        buttonPart: 'button-submit-hidden',
        reAuthButtonPart: 'button-submit'
      })
    } else if (app.globalData.userInfo.authStatus === '2') {
      this.setData({
        companyImageUrl: app.globalData.userInfo.authCompanyImage,
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
    console.log('页面初次渲染')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('页面显示')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('页面隐藏')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('页面卸载')
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