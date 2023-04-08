// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境



// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection("userAppointInfo")
    .where({
      openid: event.openid,
      createTime: event.createTime,
    })
    .update({
      data: {
        isAgree: event.isAgree,
        handleTime: new Date().getTime(),
        rejectReason:event.rejectReason
      }
    });
    
}