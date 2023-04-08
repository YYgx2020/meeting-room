// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境


// 云函数入口函数
/**
 * 更新 roomAppointInfo 中的预约信息
 * @param {roomid, dateAppointInfo} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
  
  return cloud.database().collection("roomAppointInfo")
    .where({
      roomid: event.roomid,
      date: event.time,
    })
    .update({
      data: {
        appointArr: event.appointArr
      }
    })
}