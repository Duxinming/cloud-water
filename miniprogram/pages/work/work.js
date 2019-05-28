// pages/mission/mission.js
let app = getApp();
const citys = {
  '南区': ['南一', '南二', '南三', '南四', '南五', '南六', '南七', '南八', '南九', '南十', '南十一', '南十二'],
  '北区': ['北一', '北二', '北三', '北四', '北五', '北六', '北七', '北八', '北九', '北十', '北十一', '北十二']
};
const storey = {
  '楼层': ['一楼', '二楼', '三楼', '四楼', '五楼', '六楼', '七楼', '八楼']
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    right: 'right',
    length: 3,
    large: 'large',
    userNum: null,

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
    showLocal: '请选择公寓楼',

    showTime: false,
    minHour: 10,
    maxHour: 20,
    minDate: new Date(2019, 1, 1).getTime(),
    maxDate: new Date(2029, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    showDate: new Date(new Date().getTime()),
    showFail: false,
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
  change(a) {
    console.log(a.detail.__proto__)
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
  changeFail() {
    this.setData({
      showFail: true
    })
    setTimeout(function () { that.setData({ showFail: Fail }), 800 })
  },
  onCloseFail() {
    this.setData({
      showFail: false
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
            max: true,
            loading: false,
            article: res.result.data
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
        let list1 = that.data.list - 10
        if (res.result.data.length > list1) {
          that.setData({
            articleDown: res.result.data,
            search: 0
          })
        }
        if (res.result.data.length <= list1) {
          that.setData({
            max: true,
            loading: false,
            articleDown: res.result.data
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
  //搜索
  searchTime() {
    let that = this
    wx.cloud.callFunction({
      name: 'search',
      data: {
        type: 1,
        time: that.data.showDate,
        local: that.data.showLocal,
        num: that.data.userNum,
        list: that.data.list
      },
      success(res) {
        let list1 = that.data.list - 10
        if (res.result.data.length > list1) {
          that.setData({
            article: res.result.data,
            search: 1
          })
        } if (res.result.data.length <= list1 && res.result.data.length !== 0) {
          that.setData({
            max: true,
            loading: false,
            article: res.result.data
          })
        } if (res.result.data.length === 0) {
          that.setData({
            article: [],
            max: true,
            loading: false
          })
          wx.showModal({
            title: '提示',
            content: '未查询到与此条件相符的订单',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确认')
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      false(res) {
        console.log(1)
      }
    })
  },
  searchTimeDown() {
    let that = this
    wx.cloud.callFunction({
      name: 'searchDown',
      data: {
        type: 1,
        time: that.data.showDate,
        local: that.data.showLocal,
        num: that.data.userNum,
        list: that.data.list
      },
      success(res) {
        let list1 = that.data.list - 10
        if (res.result.data.length > list1) {
          that.setData({
            articleDown: res.result.data,
            search: 1
          })
        } if (res.result.data.length <= list1 && res.result.data.length !== 0) {
          that.setData({
            max: true,
            loading: false,
            articleDown: res.result.data
          })
        } if (res.result.data.length === 0) {
          that.setData({
            articleDown: [],
            max: true,
            loading: false
          })
          wx.showModal({
            title: '提示',
            content: '未查询到与此条件相符的订单',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确认')
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      false(res) {
        console.log(1)
      }
    })
  },
  searchTimeAndLocal() {
    let that = this
    wx.cloud.callFunction({
      name: 'search',
      data: {
        type: 2,
        time: that.data.showDate,
        local: that.data.showLocal,
        num: that.data.userNum,
        list: that.data.list
      },
      success(res) {
        let list1 = that.data.list - 10
        if (res.result.data.length > list1) {
          that.setData({
            article: res.result.data,
            search: 2
          })
        } if (res.result.data.length <= list1 && res.result.data.length !== 0) {
          that.setData({
            max: true,
            loading: false,
            article: res.result.data
          })
        } if (res.result.data.length === 0) {
          that.setData({
            article: [],
            max: true,
            loading: false,
            articleDown: res.result.data
          })
          wx.showModal({
            title: '提示',
            content: '未查询到与此条件相符的订单',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确认')
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      false(res) {
        console.log(1)
      }
    })
  },
  searchTimeAndLocalDown() {
    let that = this
    wx.cloud.callFunction({
      name: 'searchDown',
      data: {
        type: 2,
        time: that.data.showDate,
        local: that.data.showLocal,
        num: that.data.userNum,
        list: that.data.list
      },
      success(res) {
        let list1 = that.data.list - 10
        if (res.result.data.length > list1) {
          that.setData({
            articleDown: res.result.data,
            search: 2
          })
        } if (res.result.data.length <= list1 && res.result.data.length !== 0) {
          that.setData({
            max: true,
            loading: false,
            articleDown: res.result.data
          })
        } if (res.result.data.length === 0) {
          that.setData({
            articleDown: [],
            max: true,
            loading: false
          })
          wx.showModal({
            title: '提示',
            content: '未查询到与此条件相符的订单',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确认')
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      false(res) {
        console.log(1)
      }
    })
  },
  searchTimeAndNum() {
    let that = this
    wx.cloud.callFunction({
      name: 'search',
      data: {
        type: 3,
        time: that.data.showDate,
        local: that.data.showLocal,
        num: that.data.userNum,
        list: that.data.list
      },
      success(res) {
        let list1 = that.data.list - 10
        if (res.result.data.length > list1) {
          that.setData({
            article: res.result.data,
            search: 3
          })
        } if (res.result.data.length <= list1 && res.result.data.length !== 0) {
          that.setData({
            max: true,
            loading: false,
            article: res.result.data
          })
        } if (res.result.data.length === 0) {
          that.setData({
            article: [],
            max: true,
            loading: false
          })
          wx.showModal({
            title: '提示',
            content: '未查询到与此条件相符的订单',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确认')
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      false(res) {
        console.log(1)
      }
    })
  },
  searchTimeAndNumDown() {
    let that = this
    wx.cloud.callFunction({
      name: 'searchDown',
      data: {
        type: 3,
        time: that.data.showDate,
        local: that.data.showLocal,
        num: that.data.userNum,
        list: that.data.list
      },
      success(res) {
        let list1 = that.data.list - 10
        if (res.result.data.length > list1) {
          that.setData({
            articleDown: res.result.data,
            search: 3
          })
        } if (res.result.data.length <= list1 && res.result.data.length !== 0) {
          that.setData({
            max: true,
            loading: false,
            articleDown: res.result.data,
          })
        } if (res.result.data.length === 0) {
          that.setData({
            articleDown: [],
            max: true,
            loading: false
          })
          wx.showModal({
            title: '提示',
            content: '未查询到与此条件相符的订单',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确认')
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      false(res) {
        console.log(1)
      }
    })
  },
  searchAll() {
    let that = this
    wx.cloud.callFunction({
      name: 'search',
      data: {
        type: 4,
        time: that.data.showDate,
        local: that.data.showLocal,
        num: that.data.userNum,
        list: that.data.list
      },
      success(res) {
        let list1 = that.data.list - 10
        if (res.result.data.length > list1) {
          that.setData({
            article: res.result.data,
            search: 4
          })
        } if (res.result.data.length <= list1 && res.result.data.length !== 0) {
          that.setData({
            max: true,
            loading: false,
            article: res.result.data
          })
        } if (res.result.data.length === 0) {
          that.setData({
            article: [],
            max: true,
            loading: false
          })
          wx.showModal({
            title: '提示',
            content: '未查询到与此条件相符的订单',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确认')
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      false(res) {
        console.log(1)
      }
    })
  },
  searchAllDown() {
    let that = this
    wx.cloud.callFunction({
      name: 'searchDown',
      data: {
        type: 4,
        time: that.data.showDate,
        local: that.data.showLocal,
        num: that.data.userNum,
        list: that.data.list
      },
      success(res) {
        let list1 = that.data.list - 10
        if (res.result.data.length > list1) {
          that.setData({
            articleDown: res.result.data,
            search: 4
          })
        } if (res.result.data.length <= list1 && res.result.data.length !== 0) {
          that.setData({
            max: true,
            loading: false,
            articleDown: res.result.data
          })
        } if (res.result.data.length === 0) {
          that.setData({
            articleDown: [],
            max: true,
            loading: false
          })
          wx.showModal({
            title: '提示',
            content: '未查询到与此条件相符的订单',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确认')
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      false(res) {
        console.log(1)
      }
    })
  },

  //点击搜索按钮
  search() {
    let that = this
    if (this.data.detail) {
      if (that.data.userNum === null && that.data.showLocal === '请选择公寓楼') {
        that.searchTimeDown()
        console.log(1)
      }
      if (that.data.userNum === null && that.data.showLocal !== '请选择公寓楼') {
        that.searchTimeAndLocalDown()
        console.log(2)
      }
      if (that.data.userNum !== null && that.data.showLocal === '请选择公寓楼') {
        if (that.data.userNum === '') {
          that.searchTimeDown()
        } else {
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
            that.searchTimeAndNumDown()
            console.log(3)
          }
        }
      }
      if (that.data.userNum !== null && that.data.showLocal !== '请选择公寓楼') {
        if (that.data.userNum === '') {
          that.searchTimeAndLocalDown()
        } else {
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
              that.searchAllDown()
              console.log(4)
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
      }
    } else {
      if (that.data.userNum === null && that.data.showLocal === '请选择公寓楼') {
        that.searchTime()
        console.log(5)
      }
      if (that.data.userNum === null && that.data.showLocal !== '请选择公寓楼') {
        that.searchTimeAndLocal()
        console.log(6)
      }
      if (that.data.userNum !== null && that.data.showLocal === '请选择公寓楼') {
        if (that.data.userNum === '') {
          that.searchTime()
        } else {
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
            that.searchTimeAndNum()
            console.log(7)
          }
        }
      }
      if (that.data.userNum !== null && that.data.showLocal !== '请选择公寓楼') {
        if (that.data.userNum === '') {
          that.searchTimeAndLocal()
        } else {
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
              that.searchAll()
              console.log(8)
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
      }
    }
  },
  //验证flag
  flag() {
    let that = this
    wx.getStorage({
      key: 'key',
      success(res) {
        console.log(res)
        wx.cloud.callFunction({
          name: 'checkFlag',
          data: { openid: res.data.openid },
          success(res) {
            console.log(res)
            if (res.result.data.length !== 0) {
              that.setData({
                flag: true
              })
            } else {
              that.setData({
                flag: false
              })
            }
          },
          fail(res) {
          }
        })
      },
      fail() {
        console.log(0)
      }
    })
  },

  down(event) {
    let that = this
    let index = event.currentTarget.dataset.index;
    if (!this.data.flag) {
      wx.showModal({
        title: '提示',
        content: '此功能只能送水的哥们操作，你只能看着',
        showCancel: false
      })
      return
    }
    if (event.currentTarget.dataset.down) {
      wx.showModal({
        title: '提示',
        content: '此订单已经被确认！',
        showCancel: false
      })
      return
    }
    if (!event.currentTarget.dataset.down) {
      let article = this.data.article
      wx.showModal({
        title: '提示',
        content: '是否确定订单已经完成？',
        success(res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'down',
              data: {
                id: event.currentTarget.dataset.id,
                down: 1
              },
              success(res) {
                console.log(res)
                if (res.result.stats.updated) {
                  article[index].down = 1;
                  that.setData({
                    article: article,
                    type: 'primary'
                  })
                }
              }, false(res) {

              }
            })
          }
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onCloseAndGetValue();
    this.flag();
    this.getArtilce()
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
            } if (that.data.search === 1) {
              that.searchTime()
            } if (that.data.search === 2) {
              that.searchTimeAndLocal()
            } if (that.data.search === 3) {
              that.searchTimeAndNum()
            } if (that.data.search === 4) {
              that.searchAll()
            }
          } else {
            if (that.data.search === 0) {
              that.getArtilceDown()
            } if (that.data.search === 1) {
              that.searchTimeDown()
            } if (that.data.search === 2) {
              that.searchTimeAndLocalDown()
            } if (that.data.search === 3) {
              that.searchTimeAndNumDown()
            } if (that.data.search === 4) {
              that.searchAllDown()
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