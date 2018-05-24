var app = getApp();
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

function getListData(queryCondition, that) {
  util.showBusy('请求中...')
  var options = {
    url: config.service.orderQueryUrl,
    data: queryCondition,
    success(result) {
      wx.hideToast();
      console.log('request success', result)
      that.setData({
        requestResult: JSON.stringify(result.data),
        orderInfoList: result.data.data
      })
    },
    fail(error) {
      util.showModel('请求失败', error);
      console.log('request fail', error);
    }
  }
  console.log('使用 qcloud.request 带登录态登录')
  qcloud.request(options)
}

function jumpToOrderDetail(orderInfo, that) {
  var orderInfoStr = JSON.stringify(orderInfo)
  wx.navigateTo({
    url: '../orderdetail/orderdetail?orderInfoStr=' + orderInfoStr + '&jumpType=0',
  })
}

module.exports = {
  getListData: getListData,
  jumpToOrderDetail: jumpToOrderDetail,
}
