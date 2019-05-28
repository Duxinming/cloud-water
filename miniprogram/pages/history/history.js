// miniprogram/pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    active: 0,  //当前激活的tab标签索引
    article: [],
    articleDown: [],
    loading: false,   //加载动画
    list: 10,   //每次取回的数据
    max: false  //没有更多数据时激活
  },

  //监听tab改变
  showArticle(event) {
    this.setData({
      detail: event.detail.index,
      max: false
    })
    if (!event.detail.index) {
      this.getMine()
    } else {
      this.getMineDown()
    }
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // });
  },

  getMine() {
    let that = this
    wx.getStorage({
      key: 'key',
      success(res) {
        wx.cloud.callFunction({
          name: 'getMine',
          data: {
            openid: res.data.openid,
            list: that.data.list
          },
          success(res) {
            let list1 = that.data.list - 10
            if (res.result.data.length > list1) {
              that.setData({
                article: res.result.data,
                search: 0
              })
            }
            if (res.result.data.length <= list1) {
              that.setData({
                article: res.result.data,
                max: true,
                loading: false
              })
            }
          }
        })
      }
    })
  },

  getMineDown() {
    let that = this
    wx.getStorage({
      key: 'key',
      success(res) {
        wx.cloud.callFunction({
          name: 'getMineDown',
          data: {
            openid: res.data.openid,
            list: that.data.list
          },
          success(res) {
            let list1 = that.data.list - 10
            if (res.result.data.length > list1) {
              that.setData({
                articleDown: res.result.data,
                search: 0
              })
            }
            if (res.result.data.length <= list1) {
              that.setData({
                articleDown: res.result.data,
                max: true,
                loading: false
              })
            }
          }
        })
      }
    })
  },

  remove(event) {
    let that = this
    let a = new Date().getHours()
    if (a < 17 || a > 23) {
      wx.showModal({
        title: '提示',
        content: '是否确认删除？',
        success(res) {
          let confirm = res.confirm
          if (confirm) {
            wx.cloud.callFunction({
              name: 'remove',
              data: {
                _id: event.target.dataset.id,
                down: event.target.dataset.down
              },
              success(res) {
                console.log()
                if (event.target.dataset.down === 0) {
                  that.getMine()
                  wx.showToast({
                    title: '删除成功~',
                    success(res) {
                      setTimeout(() => {
                        wx.hiedTost({})
                      }, 500);
                    }
                  })
                }
                if (event.target.dataset.down === 1) {
                  that.getMineDown()
                  wx.showToast({
                    title: '删除成功~',
                    success(res) {
                      setTimeout(() => {
                        wx.hideToast({

                        })
                      }, 500);
                    }
                  })
                }
                else {
                  wx.showModal({
                    title: '提示',
                    content: '删除失败，请稍后重试。',
                    showCancel: false
                  })
                }
              }
            })
          }
        }
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '当前为工作人员送水时间，请勿更改订单。',
        showCancel: false,
        success(res){
          console.log(res)
        },
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.getMine()
    wx.getStorage({
      key: 'key',
      success(res) {
        that.setData({
          avatarUrl: res.data.avatarUrl
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getMine();
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
    let that = this
    setTimeout(function () {
      that.getArtilce()
      that.setData({
        active: 0
      })
    }, 1000)

    setTimeout(function () { wx.stopPullDownRefresh({}) }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    if (!that.data.max) {
      that.setData({
        loading: true
      })
      if (that.data.loading && !that.data.max) {
        setTimeout(function () {
          that.setData({
            loading: false,
            list: that.data.list + 10
          })
          if (that.data.active) {
            if (that.data.search === 0) {
              that.getMine()
            }
          } else {
            if (that.data.search === 0) {
              that.getMineDown()
            }
          }

        }, 1000)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})