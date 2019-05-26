let app = getApp();

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show: false,
    localhost: app.globalData.localhost,
    openid: null
  },
  bindGetUserInfo() {
    let that = this
    this.getCodeAndlogin()
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            show: true
          })
        } else {
          wx.switchTab({
            url: '/pages/mission/mission'
          })
        }
      }
    })
  },

  setStorage() {
    wx.cloud.callFunction({
      name: 'getCode',
      data: {},
      success(res) {
        let openid = res.result.openid
        // let unionid = res.result.unionid
        wx.getUserInfo({
          success(res) {
            const userInfo = res.userInfo
            const nickName = res.userInfo.nickName
            const avatarUrl = res.userInfo.avatarUrl
            wx.cloud.callFunction({
              name: 'upUserInfo',
              data: {
                userinfo: userInfo,
                openid: openid,
                // unionid: unionid 
              },
              success(res) {
                wx.setStorage({
                  key: 'key',
                  data: { openid, nickName, avatarUrl },
                  success(res) {
                    console.log(res)
                  }
                })
              }, fail() {
              }
            })
          }
        })
      }
    })
  },

  getCodeAndlogin() {
    let that = this
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
         that.setStorage()
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  getStorage() {
    let that = this
    wx.getStorage({
      key: 'key',
      success(res) {
        console.log(res)
        wx.switchTab({
          url: '/pages/mission/mission'
        })
      },
      fail() {
        that.setStorage()
        wx.switchTab({
          url: '/pages/mission/mission'
        })
      }
    })
  },

  getSetting() {
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            show: true
          })
        } else {
          that.getStorage()
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSetting()
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