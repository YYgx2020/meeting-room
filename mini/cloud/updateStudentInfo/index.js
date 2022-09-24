// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('studentInfo')
  .where({
    openid: event.openid
  })
    .update({ // 添加数据
      data: {
        studentNumber: event.studentNumber,
        studentName: event.studentName,
        studentPhone: event.studentPhone,
        studentEmail: event.studentEmail,
        studentTeacher: event.studentTeacher,
        studentLab: event.studentLab,
        isProve: event.isProve,
        isFirst: event.isFirst,
      }
    })
}