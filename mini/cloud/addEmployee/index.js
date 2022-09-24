// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('employeeInfo')
    .add({ // 添加数据
      data: {
        companyName: event.companyName,
        employeeName: event.employeeName,
        employeePhone: event.employeePhone,
        employeeEmail: event.employeeEmail,
        employeeJob: event.employeeJob,
        openid: event.openid,
        isProve: 0,
        isFirst: 0,
      }
    })

}