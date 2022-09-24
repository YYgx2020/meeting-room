// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('teacherInfo')
    .add({ // 添加数据
      data: {
        teacherName: event.teacherName,
        teacherPhone: event.teacherPhone,
        teacherEmail: event.teacherEmail,
        lab: event.lab,
        openid: event.openid,
        isProve: 0,
        isFirst: 0,
        role: 1,
      }
    })
}