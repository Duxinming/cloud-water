// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'test-w6ns5' })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let id = event.id
  let down = event.down
  return await db.collection('articles').doc(id).update({
    data:{down: down},
    success(res){
      console.log(res)
    }
  })
}