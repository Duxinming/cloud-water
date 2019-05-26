// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'test-w6ns5' })
const db = cloud.database()
/// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('articles').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        time: event.time,
        local0: event.local[0],
        local1: event.local[1],
        local2: event.local[2],
        num: event.num,
        openId: event.openid,
        down: 0,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        now: event.now
      }
    })
  } catch (e) {
    console.error(e)
  }
}