// pages/flyerindex/flyerindex.js
var app = getApp();
var orderList = require("../orderlist/orderlistcommon.js")
var requirementList = require("../requirementList/requirelistcommon.js")
var flyerorderlist = require("../flyerorderlist/flyerorderlistcommon.js")
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIdentify: '',
    currentTab: 0,
    tabArray: ["首页", "我的订单", "个人信息"],
    tabbar: [
      {
        text: "首页",
        iconPath: "../../images/home.png",
        selectedIconPath: "../../images/home_on.png",
        selected: true
      },
      {
        text: "我的订单",
        iconPath: "../../images/order.png",
        selectedIconPath: "../../images/order_on.png",
        selected: false
      },
      {
        text: "个人信息",
        iconPath: "../../images/member.png",
        selectedIconPath: "../../images/member_on.png",
        selected: false
      }
    ],
    personalInformation: "hidden",
    orderList: "hidden",
    orderPublish: "show",
    userInfo: {},
    hasUserInfo: false,
    scrollViewStyle: "scorll-view-cell-high",
    orderTabArray: ["待审核", "待作业", "已完成", "已驳回"],
    currentOrderTab: 0,
  },

  swichNav: function (e) {
    var that = this;
    console.log(e.target)
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }

    if (e.currentTarget.dataset.current == 0) {
      this.setData({
        personalInformation: "hidden",
        orderList: "hidden",
        orderPublish: "show",
        scrollViewStyle: "scorll-view-cell-high"
      })
    } else if (this.data.currentTab == 1) {
      var that = this
      var queryCondition = {
        openId: that.data.userInfo.openId,
        status: this.data.currentOrderTab,
        }
      this.setData({
        personalInformation: "hidden",
        orderList: "show",
        orderPublish: "hidden",
        scrollViewStyle: "scorll-view-cell-low",
        flyerOrderList: flyerorderlist.getListData(queryCondition, that),
      })
      wx.setNavigationBarTitle({
        title: '我的订单',
      })
    } else if (this.data.currentTab == 2) {
      this.setData({
        personalInformation: "show",
        orderList: "hidden",
        orderPublish: "hidden",
        scrollViewStyle: "scorll-view-cell-high"
      })
      wx.setNavigationBarTitle({
        title: '个人信息',
      })
    }
  },

  swichOrderNav: function (e) {
    var that = this;
    console.log(e.target)
    if (this.data.currentOrderTab === e.target.dataset.current) {
      return false;
    } else {
      var that = this
      var queryCondition = {
        openId: that.data.userInfo.openId,
        status: e.target.dataset.current,
      }
      that.setData({
        currentOrderTab: e.target.dataset.current,
        flyerOrderList: flyerorderlist.getListData(queryCondition, that),
      })
    }
  },

  jumpToOrderDetail: function (e) {
    if (app.globalData.userInfo.authStatus === '0') {
      util.showNotAuth()
      return
    }
    console.log(e);
    requirementList.jumpToOrderDetail(e.currentTarget.dataset);
  },

  jumpToMyOrderDetail: function (e) {
    if (app.globalData.userInfo.authStatus === '0') {
      util.showNotAuth()
      return
    }
    console.log(e);
    flyerorderlist.jumpToOrderDetail(e.currentTarget.dataset);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.currentIdentify = '飞手'
    this.setData({
      currentIdentify: app.globalData.currentIdentify
    })
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
    var that = this
    if (that.data.currentTab === 0){
      var queryCondition = {
        queryType: '1'
      }
      this.setData({
        requireList: requirementList.getListData(queryCondition, that)
      });
    } else if (that.data.currentTab === 1) {
      var queryCondition = {
        openId: that.data.userInfo.openId,
        status: this.data.currentOrderTab,
      }
      this.setData({
        flyerOrderList: flyerorderlist.getListData(queryCondition, that),
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