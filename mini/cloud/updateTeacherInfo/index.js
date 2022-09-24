// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('teacherInfo')
    .where({
      openid: event.openid
    })
    .update({ // 添加数据
      data: {
        teacherName: event.teacherName,
        teacherPhone: event.teacherPhone,
        teacherEmail: event.teacherEmail,
        lab: event.lab,
        isProve: event.isProve,
        isFirst: event.isFirst,
      }
    })
}