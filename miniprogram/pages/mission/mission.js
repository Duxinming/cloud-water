let app = getApp()
const citys = {
  '南区': ['南一', '南二', '南三', '南四', '南五', '南六', '南七', '南八', '南九', '南十', '南十一', '南十二'],
  '北区': ['北一', '北二', '北三', '北四', '北五', '北六', '北七', '北八', '北九', '北十']
};
const storey = {
  '楼层': ['一楼', '二楼', '三楼', '四楼', '五楼', '六楼', '七楼']
}
// pages/mission/mission.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    right: 'right',
    length: 3,
    large: 'large',
    userNum: '',

    currentLocal: false,
    columns: [
      {
        values: Object.keys(citys),
        className: 'column1'
      },
      {
        values: citys['南区'],
        className: 'column2',
        defaultIndex: 0
      },
      {
        values: storey['楼层'],
        className: 'column3',
        defaultIndex: 0
      }
    ],
    showLocal: '请选择寝室楼',
    cneg: 1,
    showTime: false,
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2029, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    showDate: new Date(new Date().getTime()),

    showSuccess: false,
    showFail: false,
    showLocalFail: false,
    showNumFail: false,

    localhost: app.globalData.localhost,
    openid: null,

    article: [],
    articleDown: [],
    localhost: app.globalData.localhost,
    flag: false,  //验证是否为送水人员
    type: 'danger',
    active: 0,  //当前激活的tab标签索引
    search: 0,  //筛选事件的索引
    detail: 0,  //tab事件索引的index
    loading: false,   //加载动画
    list: 10,   //每次取回的数据
    max: false  //没有更多数据时激活
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, citys[value[0]]);
    return { picker, value, index }
  },
  //弹出寝室楼选择器
  showLocal() {
    this.setData({ currentLocal: true });
  },
  //关闭寝室楼选择器
  onCloseLocal() {
    this.setData({ currentLocal: false });
  },
  //点击确定时关闭寝室选择器并获取信息
  onCloseAndGetLocal(a, index) {
    console.log(a)
    this.setData({
      currentLocal: false,
      showLocal: a.detail.value,
      ceng: a.detail.index[2] + 1
    });
  },
  //改变寝室号
  changeNum(e) {
    this.setData({
      userNum: e.detail
    })
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },
  //弹出时间选择器
  showTime() {
    this.setData({ showTime: true });
  },
  //关闭时间选择器
  onCloseTime() {
    this.setData({ showTime: false });
  },
  //点击确定时关闭时间选择器并获取选择时间
  onCloseAndGetValue() {
    let that = this;
    function getdate(a) {
      a = that.data.currentDate;
      var now = new Date(a),
        y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate();
      return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " ";
    }
    this.setData({
      showTime: false,
      showDate: getdate()
    });
  },

  //弹出或关闭弹出层
  changeSuccess() {
    let that = this
    this.setData({
      showSuccess: true
    })
    setTimeout(function () { that.setData({ showSuccess: false }) }, 500)
  },
  changeFail() {
    let that = this
    this.setData({
      showFail: true
    })
    setTimeout(function () { that.setData({ showFail: false }) }, 800)
  },
  changeLocalFail() {
    let that = this
    this.setData({
      showLocalFail: true
    })
    setTimeout(function () { that.setData({ showLocalFail: false }) }, 800)
  },
  changeNumFail() {
    let that = this
    this.setData({
      showNumFail: true
    })
    setTimeout(function () { that.setData({ showNumFail: false }) }, 800)
  },
  //检测寝室号长度
  checknum() {
    if (this.data.userNum / 10 < 1 || this.data.userNum / 100 < 1) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的寝室号',
        success(res) {
          if (res.confirm) {
            console.log('ok')
          } else {
            console.log('no')
          }
        }
      })
    } else {
      this.changeLocalFail()
    }

  },
  //提交表单
  submit() {
    let that = this
    if (this.data.showLocal === '请选择寝室楼' && String(this.data.userNum) === '') {
      this.changeLocalFail()
    } if (this.data.showLocal === '请选择寝室楼' && String(this.data.userNum) !== '') {
      this.checknum()
    } if (String(this.data.userNum) === '' && this.data.showLocal !== '请选择寝室楼') {
      this.changeNumFail()
    } if (this.data.showLocal !== '请选择寝室楼' && String(this.data.userNum) !== '') {
      if (this.data.userNum / 10 < 1 || this.data.userNum / 100 < 1) {
        wx.showModal({
          title: '提示',
          content: '请输入正确的寝室号',
          success(res) {
            if (res.confirm) {
              console.log('ok')
            } else {
              console.log('no')
            }
          }
        })
      } else {
        if (that.data.ceng === parseInt(that.data.userNum / 100) || that.data.showLocal[2] + 1 === parseInt(that.data.userNum / 100)) {
          wx.showModal({
            title: '提示',
            content: '是否确认发单?',
            success(res) {
              if (res.confirm) {
                wx.getStorage({
                  key: 'key',
                  success(res) {
                    let openId = res.data.openid
                    let nickName = res.data.nickName
                    let avatarUrl = res.data.avatarUrl
                    wx.cloud.callFunction({
                      name: 'checkDown',
                      data: {
                        time: that.data.showDate,
                        local: that.data.showLocal,
                        num: that.data.userNum,
                        openid: openId,
                        nickName: nickName,
                        avatarUrl: avatarUrl,
                      },
                      success(res) {
                        if (res.result.data.length === 0) {
                          wx.cloud.callFunction({
                            name: 'upArticle',
                            data: {
                              time: that.data.showDate,
                              openid: openId,
                              nickName: nickName,
                              avatarUrl: avatarUrl,
                              local: that.data.showLocal,
                              num: that.data.userNum,
                              now: new Date().getTime() //获取当前点击的时间戳进行排序
                            },
                            success(res) {
                              that.changeSuccess()
                              that.getArtilce()
                              wx.setStorage({
                                key: 'keys',
                                data: {
                                  showLocal: that.data.showLocal,
                                  userNum: that.data.userNum,
                                  ceng: that.data.ceng
                                }
                              })
                            },
                            fail(res) {
                              that.changeFail()
                            }
                          })
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: '该寝室仍有未完成订单，请勿重复发单。'
                          })
                        }
                      }
                    })

                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          return
        } else {
          wx.showModal({
            title: '提示',
            content: '请输入与楼层对应的寝室号',
            success(res) {
              if (res.confirm) {
                console.log('ok')
              } else {
                console.log('no')
              }
            }
          })
        }

      }
    }
  },
  //取所有未完成数据
  getArtilce() {
    let that = this
    wx.cloud.callFunction({
      name: 'getArticle',
      data: { list: that.data.list },
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
      },
      fail() {
        wx.showModal({
          title: '提示',
          content: '系统错误，请稍后重试',
        })
      }
    })
  },
  //取所有已完成数据
  getArtilceDown() {
    let that = this
    wx.cloud.callFunction({
      name: 'getArticleDown',
      data: { list: that.data.list },
      success(res) {
        console.log(res)
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
      },
      fail() {
        wx.showModal({
          title: '提示',
          content: '加载错误，请重新打开小程序。',
        })
      }
    })
  },
  //监听tab改变
  showArticle(event) {
    this.setData({
      detail: event.detail.index,
      max: false
    })
    if (!event.detail.index) {
      this.getArtilce()
    } else {
      this.getArtilceDown()
    }
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.onCloseAndGetValue();
    this.getArtilce();
    wx.getStorage({
      key: 'keys',
      success(res) {
        that.setData({
          showLocal: res.data.showLocal,
          userNum: res.data.userNum,
          ceng: res.data.ceng
        })
      }
    })
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
    this.getArtilce()
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
              that.getArtilce()
            }
          } else {
            if (that.data.search === 0) {
              that.getArtilceDown()
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