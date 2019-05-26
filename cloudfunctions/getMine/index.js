// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'test-w6ns5' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const list = event.list
  console.log(event.openid)
  return await db.collection('articles').where({
    down: 0,
    openId: event.openid
  }).orderBy('now', 'desc').limit(list).get({
    success(res) {
      return res
    },
    fail() {
      console.log(1)
    }
  })
}