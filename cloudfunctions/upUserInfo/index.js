// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'test-w6ns5' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('simplearticles').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        userInfo: event.userinfo,
        nickName: event.userinfo.nickName,
        avatarUrl: event.userinfo.avatarUrl,
        openId: event.openid,
      }
    })
  } catch (e) {
    console.error(e)
  }
}