// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'test-w6ns5' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event.openid)
  try {
    return await db.collection('simplearticles').where({
        openId: event.openid, 
        flag: 1
    }).get({
      success(res){
        console.log(res)
      }
    })
  } catch (e) {
    console.error(e)
  }

}