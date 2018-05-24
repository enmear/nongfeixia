const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 100000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

//显示未认证提示
var showNotAuth = () => {
  wx.showModal({
    title: '提示',
    content: '请先完成实名认证',
    showCancel: true,
    confirmText: '去认证',
    success: function(res) {
      if(res.confirm) {
        wx.navigateTo({
          url: '../authenticationtype/authenticationtype',
        })
      }else if(res.cancel) {

      }
    }
  })
}

module.exports = { formatTime, showBusy, showSuccess, showModel, showNotAuth }
