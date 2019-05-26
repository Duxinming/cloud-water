// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'test-w6ns5' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('articles').where({
      local0: event.local[0],
      local1: event.local[1],
      local2: event.local[2],
      num: event.num,
      down: 0
    }).get({
      success(res) {
        console.log(res) 
      }
    })
  } catch (e) {
    // console.error(e)
  }
}