// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection("employeeInfo")
    .where({
      openid: event.openid
    })
    .update({
      data: {
        isProve: event.isProve,
        companyName: event.companyName,
        employeeName: event.employeeName,
        employeePhone: event.employeePhone,
        employeeEmail: event.employeeEmail,
        employeeJob: event.employeeJob,
        isFirst: event.isFirst,
      }
    })
}