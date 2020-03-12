let G = {
  userInfo: null
}
let Wechat = {}

// 微信登入通过云函数注册调用
Wechat.onRegisterUser = function(userInfo, cb) {
  wx.cloud.init({env: 'test-lgq'})
  wx.cloud.callFunction({ // 调用云函数的意思
    name: 'login',
    data: {
      userinfo: userInfo
    },
    success(res) {
      console.log('登入成功', res)
      G.userInfo = res.result.data[0].userinfo
      console.log(res.result.data[0].userinfo)
      cb && cb()
    },
    fail(err) {
      console.log(err)
    }
  })
}

// 用户主动点击分享按钮
Wechat.onShare = function() {
  wx.cloud.callFunction({
    name: 'share',
    success(res) {
      console.log('获取分享对应的信息', res.result)
      wx.shareAppMessage({
        title: res.result.title.title,
        imageUrl: res.result.pic.url
      })
    },
    fail: console.error
  })
}

Wechat.onRightUpShare = function() {
  wx.showShareMenu({
    withShareTicket: true
  })
  wx.cloud.callFunction({
    name: 'share',
    success(res) {
      console.log('这是右上角的分享信息', res.result)
      wx.onShareAppMessage(() => { // 这个其实是监听右上角的事件
        return {
          title: res.result.title.title,
          imageUrl: res.result.pic.url
        }
      })
    },
    fail: console.error
  })
}

export {G, Wechat}
