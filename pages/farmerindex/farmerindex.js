// pages/farmerindex/farmerindex.js
var app = getApp();
var orderList = require("../orderlist/orderlistcommon.js")
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIdentify: '',
    i: 0,
    focusFlag: false,
    price: "",
    currentTab: 0,
    tabArray: ["订单发布", "我的订单", "个人信息"],
    tabbar: [
      {
        text: "首页",
        iconPath: "../../images/release.png",
        selectedIconPath: "../../images/release_on.png",
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
    orderTabArray: ["待审核","待接单", "待作业", "待付款", "已完成", "已驳回"],
    currentOrderTab: 0,
    imageArray: [],
    date: '2016-09-01',
    bondScaleArray: ['10%', '20%', '30%', '40%', '50%'],
    bondScaleIndex: 0,
    terrainArray: ['平原', '丘陵', '高山', '洼地'],
    terrainIndex: 0,
    cropArray: ['水稻', '小麦', '棉花', '玉米', '油菜', '大葱', '丝瓜', '苦瓜', '大姜', '土豆', '冬枣', '烟草', '葡萄', '柑橘', '桃树', '梨树', '柚子', '橙树', '葵花', '香蕉', '南瓜', '黄豆', '茶叶', '芡实', '花椒', '甘蔗', '莲藕', '苹果树', '槟榔芋', '槟榔树', '椰子树'],
    cropIndex: 0,
    priceIndex: 0,
    priceArray: [
      {
        terrain: '平原',
        cropArray: ['水稻', '小麦', '棉花', '玉米', '油菜', '大葱', '丝瓜', '苦瓜', '大姜', '土豆', '冬枣', '烟草', '葡萄', '柑橘', '桃树', '梨树', '柚子', '橙树', '葵花', '香蕉', '南瓜', '黄豆', '茶叶', '芡实', '花椒', '甘蔗', '莲藕', '苹果树', '槟榔芋', '槟榔树', '椰子树'],
        minPriceArray: ['11', '9', '9', '13.5', '9', '7', '9', '7', '7', '7', '13.5', '14', '22.5', '18', '22.5', '22.5', '22.5', '22.5', '11', '40.5', '9', '9', '22.5', '22.5', '27', '31.5', '11', '27', '13.5', '90', '90'],
        maxPriceArray: ['13', '11', '11', '16.5', '11', '9', '11', '9', '9', '9', '16.5', '18', '27.5', '22', '27.5', '27.5', '27.5', '27.5', '13', '49.5', '11', '11', '27.5', '27.5', '33', '38.5', '13', '33', '16.5', '110', '110']
      },
      {
        terrain: '丘陵',
        cropArray: ['水稻', '小麦', '棉花', '玉米', '油菜', '大葱', '丝瓜', '苦瓜', '大姜', '土豆', '冬枣', '烟草', '葡萄', '柑橘', '桃树', '梨树', '柚子', '橙树', '葵花', '香蕉', '南瓜', '黄豆', '茶叶', '芡实', '花椒', '甘蔗', '莲藕', '苹果树', '槟榔芋', '槟榔树', '椰子树'],
        minPriceArray: ['13.5', '11', '11', '18', '13.5', '11', '11', '9', '11', '11', '18', '18', '31.5', '22.5', '27', '27', '27', '27', '13.5', '45', '11', '11', '31.5', '31.5', '40.5', '36', '13.5', '31.5', '18', '126', '126'],
        maxPriceArray: ['16.5', '13', '13', '22', '16.5', '13', '13', '11', '13', '13', '22', '22', '38.5', '27.5', '33', '33', '33', '33', '16.5', '55', '13', '13', '38.5', '38.5', '49.5', '44', '16.5', '38.5', '22', '154', '154']
      },
      {
        terrain: '高山',
        cropArray: ['水稻', '小麦', '棉花', '玉米', '油菜', '大葱', '丝瓜', '苦瓜', '大姜', '土豆', '冬枣', '烟草', '葡萄', '柑橘', '桃树', '梨树', '柚子', '橙树', '葵花', '香蕉', '南瓜', '黄豆', '茶叶', '芡实', '花椒', '甘蔗', '莲藕', '苹果树', '槟榔芋', '槟榔树', '椰子树'],
        minPriceArray: ['15', '13', '13.5', '22.5', '18', '13.5', '13.5', '11', '13.5', '15', '22.5', '22.5', '36', '31.5', '31.5', '31.5', '31.5', '31.5', '16', '63', '13.5', '13', '36', '40.5', '49', '58.5', '16', '45', '22.5', '141', '157.5'],
        maxPriceArray: ['19', '15', '16.5', '27.5', '22', '16.5', '16.5', '13', '16.5', '19', '27.5', '27.5', '44', '38', '38', '38', '38', '38', '20', '77', '16.5', '15', '44', '49.5', '59', '71.5', '20', '55', '27.5', '173', '192.5']
      },
      {
        terrain: '洼地',
        cropArray: ['水稻', '小麦', '棉花', '玉米', '油菜', '大葱', '丝瓜', '苦瓜', '大姜', '土豆', '冬枣', '烟草', '葡萄', '柑橘', '桃树', '梨树', '柚子', '橙树', '葵花', '香蕉', '南瓜', '黄豆', '茶叶', '芡实', '花椒', '甘蔗', '莲藕', '苹果树', '槟榔芋', '槟榔树', '椰子树'],
        minPriceArray: ['18', '15', '18', '27', '22.5', '15', '16', '13.5', '18', '18', '27', '27', '40.5', '40.5', '36', '40.5', '40.5', '40.5', '20', '108', '18', '15', '40.5', '49.5', '63', '67.5', '18', '49.5', '27', '162', '162'],
        maxPriceArray: ['22', '19', '22', '33', '27.5', '19', '20', '16.5', '22', '22', '33', '33', '49.5', '49.5', '44', '49.5', '49.5', '49.5', '24', '132', '22', '19', '49.5', '60.5', '77', '82.5', '22', '60.5', '33', '198', '198']
      },
    ],
    publishForm: {
      address: '',
      terrain: '',
      cropStr: '',
      price: '',
      medicament: '',
      workDate: '',
      workTime: '',
      workArea: '',
      areaNum: '',
      help: '',
      contacts: '',
      contactNum: '',
      bondScale: '',
      areaPhotoUrl: '',
      orderBalance: '0',
      bondBalance: '0'
    }
  },

  /**
   * 地址输入
   */
  addressInput: function(e) {
    var address = 'publishForm.address'
    this.setData({
      [address]: e.detail.value
    })
  },
  /**
   * 喷洒药剂输入
   */
  medicamentInput: function(e) {
    var medicament = 'publishForm.medicament'
    this.setData({
      [medicament]: e.detail.value
    })
  },

/**
 * 作业周期输入
 */
  workTimeInput: function(e) {
    var workTime = 'publishForm.workTime'
    this.setData({
      [workTime]: e.detail.value
    })
  },
  /**
   * 作业面积输入
   */
  workAreaInput: function(e) {
    var workArea = 'publishForm.workArea'
    var orderBalanceStr = 'publishForm.orderBalance'
    var orderBalance = e.detail.value * this.data.publishForm.price
    var bondBalanceStr = 'publishForm.bondBalance'
    var index = parseInt(this.data.bondScaleIndex) + 1
    var bondBalance = (index / 10) * orderBalance
    this.setData({
      [workArea]: e.detail.value,
      [orderBalanceStr]: orderBalance,
      [bondBalanceStr]: bondBalance.toFixed(2)
    })
  },
  /**
   * 地块分布输入
   */
  areaNumInput: function(e) {
    var areaNum = 'publishForm.areaNum'
    this.setData({
      [areaNum]: e.detail.value
    })
  },
  /**
   * 提供便利输入
   */
  helpInput: function(e) {
    var help = 'publishForm.help'
    this.setData({
      [help]: e.detail.value
    })
  },
  /**
   * 联系人输入
   */
  contactsInput: function(e) {
    var contacts = 'publishForm.contacts'
    this.setData({
      [contacts]: e.detail.value
    })
  },
  /**
   * 联系电话输入
   */
  contactNumInput: function(e) {
    var contactNum = 'publishForm.contactNum'
    this.setData({
      [contactNum]: e.detail.value
    })
  },
  /**
   * 判断价格输入值是否正确
   */
  priceInput: function (e) {
    console.log(e);
    var _this = this;
    var price = parseFloat(e.detail.value);
    var priceArray = this.data.priceArray;
    var priceIndex = this.data.priceIndex;
    var cropIndex = this.data.cropIndex;
    var minPrice = parseFloat(priceArray[priceIndex].minPriceArray[cropIndex]);
    var maxPrice = parseFloat(priceArray[priceIndex].maxPriceArray[cropIndex]);
    if (price < minPrice || price > maxPrice) {
      console.log('价格不在规定区间');
      wx.showModal({
        title: '提示',
        content: '价格需在' + minPrice + "元/亩~~" + maxPrice + "元/亩之间",
        showCancel: false,
        confirmText: '我知道了'
      })
    }

    var price = 'publishForm.price'
    var orderBalanceStr = 'publishForm.orderBalance'
    var orderBalance = e.detail.value * this.data.publishForm.price
    var bondBalanceStr = 'publishForm.bondBalance'
    var index = parseInt(this.data.bondScaleIndex) + 1
    var bondBalance = (index / 10) * orderBalance
    this.setData({
      [price]: e.detail.value,
      [orderBalanceStr]: orderBalance,
      [bondBalanceStr]: bondBalance.toFixed(2)
    })
  },

  /**
   * 选择地形
   */
  bindTerrainPickerChange: function (e) {
    var that = this
    var terrain = 'publishForm.terrain'
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      priceIndex: e.detail.value,
      [terrain]: that.data.priceArray[e.detail.value].terrain
    })
  },

  /**
   * 选择作物
   */
  bindCropPickerChange: function (e) {
    var that = this
    var crop = 'publishForm.crop'
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      cropIndex: e.detail.value,
      [crop]: that.data.priceArray[that.data.priceIndex].cropArray[e.detail.value]
    })
  },

  /**
  * 选择保证金比例
  */
  bindBondScalePickerChange: function (e) {
    var that = this
    var bondScale = 'publishForm.bondScale'
    var bondBalanceStr = 'publishForm.bondBalance'
    var index = parseInt(e.detail.value) + 1
    var bondBalance = (index / 10) * this.data.publishForm.orderBalance
    console.log('picker发送选择改变，携带值为', e.detail.value + '比例：' + index);
    this.setData({
      bondScaleIndex: e.detail.value,
      [bondScale]: that.data.bondScaleArray[e.detail.value],
      [bondBalanceStr]: bondBalance.toFixed(2)
    })
  },

  /**
   * 上传图片
   */
  uploadImage: function(data) {
    var that = this
    var filePath = data.tempFilePaths[that.data.i]
    var length = data.tempFilePaths.length

    // 上传图片
    wx.uploadFile({
      url: config.service.uploadUrl,
      filePath: filePath,
      name: 'file',

      success: function (res) {
        console
        res = JSON.parse(res.data)
        console.log(res.data)
        that.data.imageArray[that.data.imageArray.length] = res.data.imgUrl;
        that.setData({
          imageArray: that.data.imageArray
        })

        if (that.data.i === length - 1) {
          console.log(that.data.imageArray)
          util.showSuccess('上传图片成功')
          that.setData({
            i: 0
          })
        }else {
          that.setData({
            i: that.data.i + 1
          })
          that.uploadImage(data)
        }
      },

      fail: function (e) {
        util.showModel('上传图片失败')
        that.setData({
          i: 0
        })
      }
    })
  },
  /**
   * 选择本地图片
   */
  choiceImages: function (e) {
    var _this = this;
    wx.chooseImage({
      success: function (res) {
        console.log(res);
        if(res.tempFilePaths.length > 9) {
          wx.showModal({
            title: '提示',
            content: '最多上传9张土地照片',
            showCancel: false,
            confirmText: '知道了',
          })
        }else{
          util.showBusy('正在上传')
          _this.uploadImage(res)
        }
      },
    })
  },
  
  /**
   * 提交审核按钮
   */
  publishSubmit: function (e) {
    if (app.globalData.userInfo.authStatus == '0') {
      util.showNotAuth()
      return
    }

    var price = parseFloat(this.data.publishForm.price);
    var priceArray = this.data.priceArray;
    var priceIndex = this.data.priceIndex;
    var cropIndex = this.data.cropIndex;
    var minPrice = parseFloat(priceArray[priceIndex].minPriceArray[cropIndex]);
    var maxPrice = parseFloat(priceArray[priceIndex].maxPriceArray[cropIndex]);
    if (price < minPrice || price > maxPrice) {
      wx.showModal({
        title: '提示',
        content: '价格需在' + minPrice + "元/亩~~" + maxPrice + "元/亩之间",
        showCancel: false,
        confirmText: '我知道了'
      })
      return
    }

    if(this.data.publishForm.address === '') {
      wx.showModal({
        title: '提示',
        content: '请填写地址信息',
        showCancel: false,
        confirmText: '我知道了'
      })
      return
    }
    if (this.data.publishForm.medicament === '') {
      wx.showModal({
        title: '提示',
        content: '请填写喷洒药剂',
        showCancel: false,
        confirmText: '我知道了'
      })
      return
    }
    if (this.data.publishForm.workTime === '') {
      wx.showModal({
        title: '提示',
        content: '请填写作业周期',
        showCancel: false,
        confirmText: '我知道了'
      })
      return
    }
    if (this.data.publishForm.workArea === '') {
      wx.showModal({
        title: '提示',
        content: '请填写作业面积',
        showCancel: false,
        confirmText: '我知道了'
      })
      return
    }
    if (this.data.publishForm.areaNum === '') {
      wx.showModal({
        title: '提示',
        content: '请填写地块分布数量',
        showCancel: false,
        confirmText: '我知道了'
      })
      return
    }
    if (this.data.publishForm.help === '') {
      wx.showModal({
        title: '提示',
        content: '请填写可以为飞手提供的便利',
        showCancel: false,
        confirmText: '我知道了'
      })
      return
    }
    if (this.data.publishForm.contacts === '') {
      wx.showModal({
        title: '提示',
        content: '请填写联系人',
        showCancel: false,
        confirmText: '我知道了'
      })
      return
    }
    if (this.data.publishForm.contactNum === '') {
      wx.showModal({
        title: '提示',
        content: '请填写联系电话',
        showCancel: false,
        confirmText: '我知道了'
      })
      return
    }
    if (this.data.imageArray.length === 0) {
      wx.showModal({
        title: '提示',
        content: '请上传土地照片',
        showCancel: false,
        confirmText: '我知道了'
      })
      return
    }
    
    var areaPhotoUrl = 'publishForm.areaPhotoUrl'
    var tempUrl = '';
    for (var i = 0, length = this.data.imageArray.length; i < length; i++) {
      tempUrl = tempUrl + this.data.imageArray[i] + ';'
    }
    this.setData({
      [areaPhotoUrl]: tempUrl
    })
    
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.orderPublishUrl,
      data: that.data.publishForm,
      success(result) {
        wx.hideToast();
        wx.showModal({
          title: '提示',
          content: '订单发布成功，请等待审核',
          showCancel: true,
          confirmText: '查看订单',
          cancelText: '我知道了',
          success: function (res) {
            that.cleanPublishInfo(that)
            if (res.confirm) {
              that.setData({
                personalInformation: "hidden",
                orderList: "show",
                orderPublish: "hidden",
                scrollViewStyle: "scorll-view-cell-low",
                list: orderList.getListData(that.data.currentOrderTab, that),
                currentTab: 1
              });
              wx.setNavigationBarTitle({
                title: '我的订单',
              })
            } else if (res.cancel) {
              
            }
          }
        })
        console.log('request success', result)
        that.setData({
          requestResult: JSON.stringify(result.data)
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
   * 清空订单发布页面数据
   */
  cleanPublishInfo: function(that) {
    var address = 'publishForm.address'
    var price = 'publishForm.price'
    var medicament = 'publishForm.medicament'
    var workTime = 'publishForm.workTime'
    var workArea = 'publishForm.workArea'
    var areaNum = 'publishForm.areaNum'
    var help = 'publishForm.help'
    var contacts = 'publishForm.contacts'
    var contactNum = 'publishForm.contactNum'
    var areaPhotoUrl = 'publishForm.areaPhotoUrl'
    that.setData({
      [address]: '',
      [price]: '',
      [medicament]: '',
      [workTime]: '',
      [workArea]: '',
      [areaNum]: '',
      [help]: '',
      [contacts]: '',
      [contactNum]: '',
      [areaPhotoUrl]: '',
      imageArray:[]
    })
  },

  /**
  * tab切换
  */
  swichNav: function (e) {
    var that = this;
    console.log(e.target)
    if (app.globalData.userInfo.authStatus == '0' && e.currentTarget.dataset.current == 1) {
      util.showNotAuth()
      return
    }

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
      });
      wx.setNavigationBarTitle({
        title: '订单发布',
      })
    } else if (this.data.currentTab == 1) {
      var queryCondition = {
        publisher: that.data.userInfo.openId,
        status: this.data.currentOrderTab,
        queryType: '0'
      }
      this.setData({
        personalInformation: "hidden",
        orderList: "show",
        orderPublish: "hidden",
        scrollViewStyle: "scorll-view-cell-low",
        list: orderList.getListData(queryCondition, that)
      });
      wx.setNavigationBarTitle({
        title: '我的订单',
      })
    } else if (this.data.currentTab == 2) {
      this.setData({
        personalInformation: "show",
        orderList: "hidden",
        orderPublish: "hidden",
        scrollViewStyle: "scorll-view-cell-high"
      });
      wx.setNavigationBarTitle({
        title: '个人信息',
      })
    }
  },

  /**
   * 订单tab切换
   */
  swichOrderNav: function (e) {
    var that = this;
    console.log(e.target)
    if (this.data.currentOrderTab === e.target.dataset.current) {
      return false;
    } else {
      var queryCondition = {
        publisher: that.data.userInfo.openId,
        status: e.target.dataset.current,
        queryType: '0'
      }
      that.setData({
        currentOrderTab: e.target.dataset.current,
        list: orderList.getListData(queryCondition, that),
      })
    }
  },

  /**
   * 跳转到订单详情
   */
  jumpToOrderDetail: function (e) {
    if (app.globalData.userInfo.authStatus === '0') {
      util.showNotAuth()
      return
    }
    console.log(e);
    orderList.jumpToOrderDetail(e.currentTarget.dataset);
  },

  /**
   * 选择时间
   */
  bindDateChange: function (e) {
    var workDate = 'publishForm.workDate'
    console.log(e);
    this.setData({
      [workDate]: e.detail.value,
      date: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      personalInformation: "hidden",
      orderList: "hidden",
      orderPublish: "show",
      scrollViewStyle: "scorll-view-cell-low"
    });
    wx.setNavigationBarTitle({
      title: '订单发布',
    })
    app.globalData.currentIdentify = '农户'
    console.log(app.globalData.currentIdentify)
    this.setData({
      currentIdentify: app.globalData.currentIdentify
    })
    var that = this
    var bondScale = 'publishForm.bondScale'
    var crop = 'publishForm.crop'
    var terrain = 'publishForm.terrain'
    var workDate = 'publishForm.workDate'
    var openId = 'publishForm.openId'
    this.setData ({
      [bondScale]: that.data.bondScaleArray[that.data.bondScaleIndex],
      [crop]: that.data.priceArray[that.data.priceIndex].cropArray[that.data.cropIndex],
      [terrain]: that.data.priceArray[that.data.priceIndex].terrain,
      [workDate]: that.data.date,
      [openId]: app.globalData.userInfo.openId
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
    if(that.data.currentTab === 1){
      var queryCondition = {
        publisher: that.data.userInfo.openId,
        status: that.data.currentOrderTab,
        queryType: '0'
      }
      this.setData({
        list: orderList.getListData(queryCondition, that)
      });
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