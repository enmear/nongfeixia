// pages/orderdetail/orderdetail.js
var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: "0",
    orderInfo: {},
    buttonName: '',
    buttonStyle: 'button-done',
    orderStatus: '',
    showModalStatus: false,
    disabled: true,
    payWayBtn: 'btn_ok',
    payWayTips: '钱包支付',
    flyImageUrl: '../../images/order/add_image.png',
    payFee: '0.00'
  },

  submit: function (e) {
    var options
    var payCondition
    var that = this
    if (app.globalData.currentIdentify === '农户' || app.globalData.currentIdentify === '经销商') {
      this.util("open", '0')
      return
    } else if (app.globalData.currentIdentify === '飞手') {
      if (this.data.orderInfo.work_status === null || this.data.orderInfo.work_status === undefined || this.data.orderInfo.work_status === '') {
        if (this.data.orderInfo.publish_status === '2') { //接单
          options = {
            url: config.service.receptOrderUrl,
            data: {
              orderId: this.data.orderInfo.order_id,
              worker: this.data.userInfo.openId
            },
            success(result) {
              wx.hideToast();
              console.log('request success', result)
              if (result.data.code === 0) {
                wx.showModal({
                  title: '提示',
                  content: '接单成功，请等待管理员审核，您可以在我的订单中查看审核状态',
                  showCancel: false,
                  confirmText: '我知道了',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateBack({  //返回
                        delta: 1
                      })
                    }
                  }
                })
              }else{
                wx.showModal({
                  title: '提示',
                  content: result.data.data,
                  showCancel: false,
                  confirmText: '我知道了'
                })
              }
            },
            fail(error) {
              util.showModel('请求失败', error);
              console.log('request fail', error);
            }
          }
        } else {
          return
        }
      } else if (this.data.orderInfo.work_status === '1') {  //订单完成
        this.util("open", '1')
        return
      }
    }

    util.showBusy('请求中...')
    console.log('使用 qcloud.request 带登录态登录')
    qcloud.request(options)
  },

  pay: function (payType) {
    var options
    var payCondition
    var that = this
    if (this.data.orderInfo.publish_status === '1') { //支付保证金
      payCondition = {
        recordType: '01',
        recordBalance: this.data.orderInfo.bond_balance,
        // recordBalance: '0.01',
        orderId: this.data.orderInfo.order_id,
        typeNiche: '02',
        publisher: this.data.orderInfo.publisher,
        walletType: '1',
        body: '农飞侠保证金支付',
        payType: payType
      }
    } else if (this.data.orderInfo.publish_status === '4') {  //支付全款
      var orderBalance = parseFloat(this.data.orderInfo.order_balance)
      var bondBalance = parseFloat(this.data.orderInfo.bond_balance)
      var recordBalance = orderBalance - bondBalance
      payCondition = {
        recordType: '01',
        recordBalance: recordBalance,   //支付金额（除去保证金的尾款）
        orderBalance: this.data.orderInfo.order_balance,  //订单金额
        // recordBalance: '0.01',
        orderId: this.data.orderInfo.order_id,
        typeNiche: '01',
        publisher: this.data.orderInfo.publisher,
        recordId: this.data.orderInfo.record_id,
        walletType: '0',
        worker: this.data.orderInfo.worker_id,
        body: '农飞侠订单支付',
        payType: payType
      }
    }
    payCondition['currentIdentify'] = app.globalData.currentIdentify
    options = {
      url: config.service.doPaymentUrl,
      data: payCondition,
      success(result) {
        wx.hideToast();
        var wxPayOrderId = result.data.data.wxPayOrderId
        console.log('request success', result)
        if (result.data.data.payType === '1') { // 微信支付
          wx.requestPayment({
            timeStamp: result.data.data.timeStamp,
            nonceStr: result.data.data.nonceStr,
            package: result.data.data.package,
            signType: result.data.data.signType,
            paySign: result.data.data.paySign,
            'success': function (res) {
              console.log(res);
              that.updateWxPay(wxPayOrderId, 'SUCCESS', '0', '支付成功', payCondition, that) //更新微信支付订单状态
            },
            'fail': function (res) {
              console.log('fail:' + JSON.stringify(res));
              // that.updateWxPay(wxPayOrderId, 'FAIL', '-1', '支付失败', payCondition) //更新微信支付订单状态
            }
          })
        } else if (result.data.data.payType === '0') {  //钱包支付
          var tipContent = '支付成功，您可在我的订单中查看订单最新状态'
          if (that.data.orderInfo.publish_status === '4') {
            tipContent = '支付成功，保证金稍后将会退还到您的钱包，您可在我的订单中查看订单最新状态'
          }
          wx.showModal({
            title: '提示',
            content: tipContent,
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
        }
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }

    util.showBusy('请求中...')
    console.log('使用 qcloud.request 带登录态登录')
    qcloud.request(options)
  },

  /**
   * 微信支付订单状态更新
   */
  updateWxPay: function (wxPayOrderId, payStatus, errCode, errCodeDes, payCondition, that) {
    var options
    payCondition['wxPayOrderId'] = wxPayOrderId
    payCondition['errCode'] = errCode
    payCondition['errCodeDes'] = errCodeDes
    payCondition['payStatus'] = payStatus
    options = {
      url: config.service.payOrderUrl,
      data: payCondition,
      success(result) {
        console.log(result)
        wx.hideToast();
        if(result.data.code === 0) {
          var tipContent = '支付成功，您可在我的订单中查看订单最新状态'
          if (that.data.orderInfo.publish_status === '4') {
            tipContent = '支付成功，保证金稍后将会退还到您的钱包，您可在我的订单中查看订单最新状态'
          }
          wx.showModal({
            title: '提示',
            content: tipContent,
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
        }else {
          wx.showModal({
            title: '提示',
            content: '订单状态刷新失败，请联系客服人员',
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
        }
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
        wx.showModal({
          title: '提示',
          content: '订单状态刷新失败，请联系客服人员',
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
      }
    }
    util.showBusy('请求中...')
    console.log('使用 qcloud.request 带登录态登录')
    qcloud.request(options)
  },

  powerDrawer: function (e) {
    if (this.data.payWayBtn === 'btn_disabled' && e.currentTarget.dataset.paytype === "0") {
      return
    } else if (e.currentTarget.dataset.paytype === "0" || e.currentTarget.dataset.paytype === "1") {
      this.pay(e.currentTarget.dataset.paytype)
    }
    var currentStatu = e.currentTarget.dataset.statu;
    this.util('close', e.currentTarget.dataset.showtype)
  },

  doneSubmit: function (e) {
    if (this.data.flyImageUrl === '../../image/order/add_image.png') {
      wx.showModal({
        title: '提示',
        content: '请上传作业的飞行线路图',
        showCancel: false,
        confirmText: '知道了',
      })
      return
    } else {
      if (this.data.orderInfo.work_status === '1') {  //订单完成
        var options
        var payCondition
        var that = this
        options = {
          url: config.service.orderDoneUrl,
          data: {
            orderId: this.data.orderInfo.order_id,
            recordId: this.data.orderInfo.record_id,
            flyImage: this.data.flyImageUrl
          },
          success(result) {
            wx.hideToast();
            wx.showModal({
              title: '提示',
              content: '提交成功，待管理员审核通过之后将会安排付款',
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

        util.showBusy('请求中...')
        console.log('使用 qcloud.request 带登录态登录')
        qcloud.request(options)
      }
    }

    var currentStatu = e.currentTarget.dataset.statu;
    this.util('close', e.currentTarget.dataset.showtype)
  },

  util: function (currentStatu, showType) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {

        if (showType === '0') { //支付
          this.setData(
            {
              showModalStatus: false
            }
          );
        } else if (showType === '1') { //订单完成
          this.setData(
            {
              showDoneDiaog: false
            }
          );
        }
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      if (showType === '0') { //支付
        this.setData(
          {
            showModalStatus: true
          }
        );
      } else if (showType === '1') { //订单完成
        this.setData(
          {
            showDoneDiaog: true
          }
        );
      }
    }
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
              flyImageUrl: res.data.imgUrl
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }

    var orderInfo = JSON.parse(options.orderInfoStr)
    var jumpType = options.jumpType  //跳转类型 0-农户和经销商跳转详情  1-飞手接单列表跳转详情  2-飞手个人订单跳转详情
    console.log(orderInfo);
    console.log(jumpType)
    this.setData({
      orderInfo: orderInfo.index
    });

    if (jumpType === '0') {
      this.setData({
        orderStatus: this.data.orderInfo.orderStatus
      })
      if (orderInfo.index.publish_status === '1') {
        this.setData({
          buttonName: '去支付保证金'
        });
      } else if (orderInfo.index.publish_status === '4') {
        this.setData({
          buttonName: '去支付'
        });
      } else {
        this.setData({
          buttonStyle: 'button-done-none'
        });
      }
    } else if (jumpType === '1') {
      this.setData({
        orderStatus: this.data.orderInfo.orderStatus
      })
      if (orderInfo.index.publish_status === '2') {
        this.setData({
          buttonName: '我要接单'
        });
      } else {
        this.setData({
          buttonStyle: 'button-done-none'
        });
      }
    } else if (jumpType === '2') {
      this.setData({
        orderStatus: this.data.orderInfo.workStatus
      })
      if (orderInfo.index.work_status === '1') {
        this.setData({
          buttonName: '已完成'
        });
      }
      // else if (orderInfo.index.work_status === '2') {
      //   this.setData({
      //     buttonName: '已完成'
      //   });
      // } 
      else {
        this.setData({
          buttonStyle: 'button-done-none'
        });
      }
    }

    if (this.data.orderStatus === null || this.data.orderStatus === undefined || this.data.orderStatus === '') {
      this.setData({
        orderStatus: this.data.orderInfo.orderStatus
      });
    }

    var walletBalance = parseFloat(this.data.userInfo.walletBalance)
    
    if (this.data.orderInfo.publish_status === '1'){
      var payBalance = parseFloat(this.data.orderInfo.bond_balance)
      if (walletBalance < payBalance) {
        this.setData({
          payWayBtn: "btn_disabled",
          payWayTips: "钱包支付(余额不足)",
          payFee: payBalance + ''
        });
      }
    } else if (this.data.orderInfo.publish_status === '4'){
      var payBalance = parseFloat(this.data.orderInfo.order_balance) - parseFloat(this.data.orderInfo.bond_balance)
      if (walletBalance < payBalance) {
        this.setData({
          payWayBtn: "btn_disabled",
          payWayTips: "钱包支付(余额不足)",
          payFee: payBalance + ''
        });
      }
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