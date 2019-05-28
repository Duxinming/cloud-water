// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'test-w6ns5' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event.local[0])
  const list = event.list
  if (event.type === 1) {
    return await db.collection('articles').where({
      down: 0,
      time: event.time
    }).orderBy('now', 'desc').limit(list).get({
      success(res) {
        return res
      },
      fail() {
        console.log(1)
      }
    })
  }
  if (event.type === 2) {
    return await db.collection('articles').where({
      down: 0,
      time: event.time,
      local0: event.local[0], 
      local1: event.local[1], 
      local2: event.local[2]
    }).orderBy('now', 'desc').limit(list).get({
      success(res) {
        return res
      },
      fail() {
        console.log(1)
      }
    })
  }
  if (event.type === 3) {
    return await db.collection('articles').where({
      down: 0,
      time: event.time,
      num: event.num
    }).orderBy('now', 'desc').limit(list).get({
      success(res) {
        return res
      },
      fail() {
        console.log(1)
      }
    })
  }
  if (event.type === 4) {
    return await db.collection('articles').where({
      down: 0,
      time: event.time,
      local0: event.local[0], 
      local1: event.local[1], 
      local2: event.local[2],
      num: event.num
    }).orderBy('now', 'desc').limit(list).get({
      success(res) {
        return res
      },
      fail() {
        console.log(1)
      }
    })
  }
}